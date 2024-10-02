import { inject, injectable, injectAll } from "tsyringe";
import { IDomainEvent, IEventDispatcher, IEventHandler, IEventPublisher } from "../../domain/DomainEvent";
import logger from "../../cross_cutting/logging/logger";

@injectable()
export class ProfileEventDispatcher implements IEventDispatcher {
    constructor(
        @inject("IProfileEventPublisher") private publisher: IEventPublisher,
        @injectAll("IProfileEventHandler") private handlers: IEventHandler[]
      ) {}

      async dispatch(event: IDomainEvent): Promise<void> {
        // Publish the event externally
        logger.info(`Publishing event: ${event.eventType}`);
        await this.publisher.publish(event);
        logger.info(`Exernal Event published: ${event.eventType}`);

        // Handle the event internally
        const relevantHandlers = this.handlers.filter(h => h.eventType === event.eventType);
        await Promise.all(relevantHandlers.map(handler => handler.handle(event)));
        logger.info(`Event handled internally: ${event.eventType}`);
      }
}