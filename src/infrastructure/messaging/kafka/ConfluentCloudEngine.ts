// import { SchemaRegistry, SchemaType } from "@kafkajs/confluent-schema-registry";
import { Consumer, Kafka, logLevel, Mechanism, Message, Producer, ProducerRecord, SASLOptions } from "kafkajs";
import { inject, injectable } from "tsyringe";
import { kafkaConfig } from "../../../cross_cutting/config/messaging";
import { IDomainEvent } from "../../../domain/DomainEvent";
import logger from "../../../cross_cutting/logging/logger";


class KafkaConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KafkaConnectionError";
  }
}

class KafkaPublishError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KafkaPublishError";
  }
}

type PlainSASLConfig = {
  mechanism: 'plain';
  username: string;
  password: string;
};

function isPlainSASLConfig(config: any): config is PlainSASLConfig {
  return config && config.mechanism === 'plain' && 'username' in config && 'password' in config;
}

@injectable()
export class ConfluentCloudEngine {
  private producer: Producer;
  private consumer: Consumer;
  // private schemaRegistry: SchemaRegistry;
  private isConnected: boolean = false;
  private connectionPromise: Promise<void> | null = null;
  private reconnectAttempts: number = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_INTERVAL = 5000; // 5 seconds

  private static _kafka: ConfluentCloudEngine;

  constructor() {
    if (!kafkaConfig.sasl) {
      throw new Error('Missing SASL configuration');
    }
    if (!isPlainSASLConfig(kafkaConfig.sasl)) {
      throw new Error('Invalid SASL configuration: expected plain mechanism with username and password');
    }

    const sasl: SASLOptions = {
      mechanism: 'plain',
      username: kafkaConfig.sasl.username,
      password: kafkaConfig.sasl.password
    };

    const kafka = new Kafka({
      clientId: 'swolemate-app',
      brokers: kafkaConfig.brokers,
      ssl: true,
      sasl,
      logLevel: logLevel.INFO,
      retry: {
        initialRetryTime: 100,
        retries: 8
      }
    });

    this.producer = kafka.producer();
    this.consumer = kafka.consumer({ groupId: 'notification-service' });
    // this.schemaRegistry = new SchemaRegistry({
    //   host: schemaRegistryConfig.host,
    //   auth: schemaRegistryConfig.auth
    // });
  }

  public static getInstance(): ConfluentCloudEngine {
    if (!ConfluentCloudEngine._kafka) {
      ConfluentCloudEngine._kafka = new ConfluentCloudEngine();
    }
    return ConfluentCloudEngine._kafka;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this._connect();
    return this.connectionPromise;
  }

  private async _connect(): Promise<void> {
    try {
      logger.info("Connecting to Kafka...");
      await Promise.all([
        this.producer.connect(),
        this.consumer.connect()
      ]);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      logger.info('Connected to Kafka Successfully');
    } catch (error) {
      logger.error('Error connecting to Kafka:', error);
      if (error instanceof Error) {
        throw new KafkaConnectionError(`Failed to connect to Kafka: ${error.message}`);
      }
    } finally {
      this.connectionPromise = null;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await Promise.all([
        this.producer.disconnect(),
        this.consumer.disconnect()
      ]);
      this.isConnected = false;
      logger.info('Disconnected from Kafka Successfully');
    } catch (error) {
      logger.error('Error disconnecting from Kafka:', error);
      if (error instanceof Error) {
        throw new KafkaConnectionError(`Failed to disconnect from Kafka: ${error.message}`);
      }
    }
  }

  private async ensureConnected(): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  private async handleDisconnection(): Promise<void> {
    this.isConnected = false;
    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      logger.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})...`);
      await new Promise(resolve => setTimeout(resolve, this.RECONNECT_INTERVAL));
      await this.connect();
    } else {
      throw new KafkaConnectionError('Max reconnection attempts reached. Unable to establish connection to Kafka.');
    }
  }

  async publish(event: IDomainEvent): Promise<void> {
    logger.info('Publishing event:', event);

    try {
      await this.ensureConnected();

      const record: ProducerRecord = {
        topic: event.eventType,
        messages: [{ value: JSON.stringify(event) }],
      };

      await this.producer.send(record);
      logger.info(`Event published successfully: ${event.eventType}`);
    } catch (error) {
      if (error instanceof KafkaConnectionError) {
        await this.handleDisconnection();
        return this.publish(event); // Retry publishing after reconnection
      }
      logger.error('Error publishing to Kafka:', error);
      if (error instanceof Error) {
        throw new KafkaPublishError(`Failed to publish event to Kafka: ${error.message}`);
      }
    }
  }

  async consume(topic: string, callback: (message: Message) => Promise<void>): Promise<void> {
    try {
      await this.ensureConnected();
      await this.consumer.subscribe({ topic, fromBeginning: true });

      await this.consumer.run({
        eachMessage: async ({ message }) => {
          try {
            await callback(message);
          } catch (error) {
            logger.error(`Error processing message from topic ${topic}:`, error);
            // Depending on your error handling strategy, you might want to:
            // - Skip the message
            // - Retry processing
            // - Send to a dead-letter queue
            // For now, we'll just log the error and continue
          }
        },
      });
    } catch (error) {
      if (error instanceof KafkaConnectionError) {
        await this.handleDisconnection();
        return this.consume(topic, callback); // Retry consuming after reconnection
      }
      logger.error(`Error setting up consumer for topic ${topic}:`, error);
      throw error;
    }
  }
}

export const confluentCloudEngine = ConfluentCloudEngine.getInstance();
