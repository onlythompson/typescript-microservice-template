// File: src/cross_cutting/logging/logger.ts

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { APP_CONFIG } from '../config/app';
import { OBSERVABILITY_CONFIG } from '../config/observability';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that we want to link the colors 
winston.addColors(colors);

// Define the format of the logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}${info.metadata && Object.keys(info.metadata).length ? ' ' + JSON.stringify(info.metadata) : ''}`
  ),
);

// Create a function to get log file transport
const getFileTransport = (filename: string, level: string) => new DailyRotateFile({
  filename: `logs/${filename}-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  level,
});

// Define which transports the logger must use to print out messages 
const transports = [
  // Console transport
  new winston.transports.Console({
    level: OBSERVABILITY_CONFIG.logging.level,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }),

  // File transport for all logs
  getFileTransport('application', OBSERVABILITY_CONFIG.logging.level),

  // File transport for error logs
  getFileTransport('error', 'error'),
];

// Elasticsearch transport (if configured)
if (OBSERVABILITY_CONFIG.logging.elasticsearchNode) {
  const elasticsearch = require('winston-elasticsearch');
  transports.push(
    new elasticsearch.ElasticsearchTransport({
      level: 'info',
      clientOpts: { node: OBSERVABILITY_CONFIG.logging.elasticsearchNode },
      index: 'logs'
    })
  );
}

// Create the logger instance
const logger = winston.createLogger({
  level: OBSERVABILITY_CONFIG.logging.level,
  levels,
  format,
  transports,
});

// Create a stream object with a 'write' function that will be used by morgan
const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export { logger, stream };

// Example usage
export default {
  error: (message: string, meta?: any) => logger.error(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  info: (message: string, meta?: any) => logger.info(message, meta),
  http: (message: string, meta?: any) => logger.http(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta),
};