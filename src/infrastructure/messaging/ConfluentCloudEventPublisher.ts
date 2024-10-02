import { inject, injectable } from "tsyringe";
import { IDomainEvent, IEventPublisher } from "../../domain/DomainEvent";
import { ConfluentCloudEngine } from "./kafka/ConfluentCloudEngine";


@injectable()
export class ConfluentCloudEventPublisher implements IEventPublisher {

  constructor(@inject(ConfluentCloudEngine) private confluentCloudEngine: ConfluentCloudEngine) {
  }

  async publish(event: IDomainEvent): Promise<void> {
    await this.confluentCloudEngine.publish(event);
  }
}