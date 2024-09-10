// use-cases/getTaskByIdUseCase.ts
import { injectable, inject } from 'tsyringe';
import { TaskServices } from '../services';
import { CreateTaskDTO, TaskDTO, UpdateTaskDTO } from '../dto';
import { TaskSerializer } from '../serializers';

@injectable()
export class GetTaskByIdUseCase {
  constructor(
    @inject(TaskServices) private taskService: TaskServices
  ) {}

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
  ) {}

  async execute(): Promise<TaskDTO[]> {
    const tasks = await this.taskService.getAllTasks();
    return tasks.map(task => TaskSerializer.serialize(task));
  }
}

@injectable()
export class CreateTaskUseCase {
  constructor(
    @inject(TaskServices) private taskService: TaskServices
  ) {}

  async execute(task: CreateTaskDTO): Promise<any> {
    const newTask = TaskSerializer.deserialize(task);
    const createdTask = await this.taskService.createTask(newTask);
    return TaskSerializer.serialize(createdTask);
  }
}

@injectable()
export class UpdateTaskUseCase {
  constructor(
    @inject(TaskServices) private taskService: TaskServices
  ) {}

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
  ) {}

  async execute(id: string): Promise<boolean> {
    return this.taskService.deleteTask(id);
  }
}