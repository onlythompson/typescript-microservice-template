// use-cases/getTaskByIdUseCase.ts
import { injectable, inject } from 'tsyringe';
import { TaskServices } from '../services';
import { CreateTaskDTO, TaskDTO, UpdateTaskDTO } from '../dto';
import { TaskSerializer } from '../serializers';
import { TaskRegistered, TaskRegisteredEvent } from '../../../domain/task/TaskEvent';
import { IEventDispatcher } from '../../../domain/DomainEvent';

@injectable()
export class GetTaskByIdUseCase {
  constructor(
    @inject(TaskServices) private taskService: TaskServices
  ) { }

  async execute(id: string): Promise<TaskDTO | null> {
    const task = await this.taskService.getTaskById(id);
    if (task) {
      return TaskSerializer.serialize(task);
    }
    return null;
  }
}

@injectable()
export class GetAllTasksUseCase {
  constructor(
    @inject(TaskServices) private taskService: TaskServices
  ) { }

  async execute(): Promise<TaskDTO[]> {
    const tasks = await this.taskService.getAllTasks();
    return tasks.map(task => TaskSerializer.serialize(task));
  }
}

@injectable()
export class CreateTaskUseCase {
  constructor(
    @inject(TaskServices) private taskService: TaskServices,
    @inject('IEventDispatcher') private eventDispatcher: IEventDispatcher
  ) { }

  async execute(task: CreateTaskDTO): Promise<any> {
    const newTask = TaskSerializer.deserialize(task);
    const createdTask = await this.taskService.createTask(newTask);

    const task_event_payload: TaskRegistered = {
      id: createdTask.id,
      name: createdTask.title,
      email: createdTask.description
    }

    const _version = 0; //this is the first ever event for this aggregate

    const profile_event = new TaskRegisteredEvent(task_event_payload.id, _version, task_event_payload);
    await this.eventDispatcher.dispatch(profile_event);

    return TaskSerializer.serialize(createdTask);
  }
}

@injectable()
export class UpdateTaskUseCase {
  constructor(
    @inject(TaskServices) private taskService: TaskServices
  ) { }

  async execute(id: string, task: UpdateTaskDTO): Promise<any> {
    const taskToUpdate = TaskSerializer.deserialize(task);
    const updatedTask = await this.taskService.updateTask(id, taskToUpdate);
    if (updatedTask) {
      return TaskSerializer.serialize(updatedTask);
    }
    return null;
  }
}

@injectable()
export class DeleteTaskUseCase {
  constructor(
    @inject(TaskServices) private taskService: TaskServices
  ) { }

  async execute(id: string): Promise<boolean> {
    return this.taskService.deleteTask(id);
  }
}