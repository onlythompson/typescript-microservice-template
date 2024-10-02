import { DomainEvent } from "../DomainEvent";
import { TaskEventDefinition } from "../EventDefinitions";

export interface TaskRegistered{
    id: string;
    name: string;
    email: string;
}


export class TaskRegisteredEvent extends DomainEvent<TaskRegistered>{
    constructor(
        aggregateId: string,
        version: number,
        payload: TaskRegistered
    ){
        super(TaskEventDefinition.TASK_REGISTERED, aggregateId, 'user_Task', version, payload);
    }

    get id(): string{
        return this.payload.id;
    }
    get name(): string{
        return this.payload.name;
    }
    get email(): string{
        return this.payload.email;
    }
}