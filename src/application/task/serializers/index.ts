
import { Task } from '../../../domain/task';

export class TaskSerializer {
  static serialize(task: Task): any {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
    };
  }

  static deserialize(data: any): Task {
    if (!data.id || !data.title || !data.description || typeof data.completed !== 'boolean') {
      throw new Error('Invalid data');
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      completed: data.completed,
    };
  }
}