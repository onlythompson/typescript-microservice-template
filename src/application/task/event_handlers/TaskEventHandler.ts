import { inject, injectable } from "tsyringe";
import { IEventHandler } from "../../../domain/DomainEvent";
import { TaskEventDefinition } from "../../../domain/EventDefinitions";
import { TaskRegistered, TaskRegisteredEvent } from "../../../domain/task/TaskEvent";


// @injectable()
// export class TaskEventHandler implements IEventHandler<TaskRegisteredEvent> {
//     public readonly eventType = TaskEventDefinition.TASK_REGISTERED;
//     constructor(
//         @inject('SomeRepository') private someRepository: SomeRelatedRepository) { }

//   async handle(event: TaskRegisteredEvent): Promise<void> {
//     const matchRequestPayload = event.payload as TaskRegistered;
//     // const someRequest = await this.someRepository.getById(matchRequestPayload.matchRequestId);
//     // someRequest!.someRequestStatus = someRequestStatus.ACCEPTED;

//     // const match: Match = {
//     //     id: '',
//     //     profileId: matchRequest!.senderProfileId,
//     //     matchedProfileId: matchRequest!.receiverProfileId,
//     //     matchStatus: MatchStatus.ACTIVE
//     //     };
//     // await this.someRepository.doSomething(match);
//   }
// }