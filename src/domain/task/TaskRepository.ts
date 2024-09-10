import { injectable } from 'tsyringe';
import { Task } from './Task';

@injectable()
export class TaskRepository {
  public constructor() {}

  async getById(id: string): Promise<Task | null> {
    // Implementation here
    return null;
  }

  async getAll(): Promise<Task[]> {
    // Implementation here
    return [];
  }

  async create(task: Task): Promise<Task> {
    // Implementation here
    return task;
  }

  async update(id: string, task: Partial<Task>): Promise<Task | null> {
    // Implementation here
    return null;
  }

  async delete(id: string): Promise<boolean> {
    // Implementation here
    return false;
  }
}