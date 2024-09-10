
export interface TaskDTO {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}