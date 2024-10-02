
import { v4 as uuidv4 } from "uuid";

export interface IDomainEvent<T = any> {
    eventId: string;
    eventType: string;
    aggregateId: string;
    aggregateType: string;
    timestamp: Date;
    version: number;
    payload: T;
}


// Abstract base class for domain events
export abstract class DomainEvent<T = any> implements IDomainEvent<T> {
    public readonly eventId: string;
    public readonly timestamp: Date;
  
    constructor(
      public readonly eventType: string,
      public readonly aggregateId: string,
      public readonly aggregateType: string,
      public readonly version: number,
      public readonly payload: T
    ) {
      this.eventId = uuidv4();
      this.timestamp = new Date();
    }
  }

  // Define the type for event handlers
export interface IEventHandler<T extends IDomainEvent = IDomainEvent> {
  eventType: string;
  handle(event: T): Promise<void>;
}

// Event Publisher interface
export interface IEventPublisher {
  publish(event: IDomainEvent): Promise<void>;
}

// Event Dispatcher interface
export interface IEventDispatcher {
  dispatch(event: IDomainEvent): Promise<void>;
}
