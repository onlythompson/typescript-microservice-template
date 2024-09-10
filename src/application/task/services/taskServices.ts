// services/taskService.ts
import { injectable, inject } from 'tsyringe';
import { Task, TaskRepository } from '../../../domain/task';

@injectable()
export class TaskServices {
  constructor(
    @inject('TaskRepository') private taskRepository: TaskRepository
  ) {}

  async getTaskById(id: string): Promise<Task | null> {
    return this.taskRepository.getById(id);
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.getAll();
  }

  async createTask(task: Task): Promise<Task> {
    return this.taskRepository.create(task);
  }

  async updateTask(id: string, task: Task): Promise<Task | null> {
    return this.taskRepository.update(id, task);
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.taskRepository.delete(id);
  }
}