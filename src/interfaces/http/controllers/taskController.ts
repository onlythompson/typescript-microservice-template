import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { GetTaskByIdUseCase, GetAllTasksUseCase, CreateTaskUseCase, UpdateTaskUseCase, DeleteTaskUseCase   } from '../../../application/task/use-cases';
import { CreateTaskDTO, UpdateTaskDTO } from '../../../application/task/dto';
import { httpRequestErrorHandler } from '../../../utils/http_helpers';

/**
 * TasksController handles the HTTP requests related to Tasks management.
 */
@injectable()
export class TaskController {
  constructor(
    @inject(GetTaskByIdUseCase) private getTaskByIdUseCase: GetTaskByIdUseCase,
    @inject(GetAllTasksUseCase) private getAllTasksUseCase: GetAllTasksUseCase,
    @inject(CreateTaskUseCase) private createTaskUseCase: CreateTaskUseCase,
    @inject(UpdateTaskUseCase) private updateTaskUseCase: UpdateTaskUseCase,
    @inject(DeleteTaskUseCase) private deleteTaskUseCase: DeleteTaskUseCase
  ) { }

  /**
   * Handles the request to retrieve an Task by its unique identifier.
   * 
   * @param req - The Express request object
   * @param res - The Express response object
   * @returns A promise that resolves to the Task entity
   */
  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const Task = await this.getTaskByIdUseCase.execute(req.params.TaskId);
      if (!Task) {
        res.status(404).send();
        return;
      }
      res.json(Task);
    } catch (error) {
       httpRequestErrorHandler(res, error);
    }
  }

  /**
   * Handles the request to retrieve all Tasks.
   * 
   * @param req - The Express request object
   * @param res - The Express response object
   * @returns A promise that resolves to an array of Task entities
   */
  async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      const Tasks = await this.getAllTasksUseCase.execute();
      res.json(Tasks);
    } catch (error) {
      httpRequestErrorHandler(res, error);
    }
  }

  /**
   * Handles the request to create a new Task.
   * 
   * @param req - The Express request object
   * @param res - The Express response object
   * @returns A promise that resolves when the Task is created
   */
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const createTaskDTO: CreateTaskDTO = req.body;
      const newTask = await this.createTaskUseCase.execute(createTaskDTO);
      res.status(201).send(newTask);
    } catch (error) {
      httpRequestErrorHandler(res, error);
    }
  }

  /**
   * Handles the request to update an existing Task.
   * 
   * @param req - The Express request object
   * @param res - The Express response object
   * @returns A promise that resolves when the Task is updated
   */
  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const updateTaskDTO: UpdateTaskDTO = req.body;
      const result = await this.updateTaskUseCase.execute(req.params.id, updateTaskDTO);
      res.status(204).send();
    } catch (error) {
      httpRequestErrorHandler(res, error);
    }
  }

  /**
   * Handles the request to delete an Task by its unique identifier.
   * 
   * @param req - The Express request object
   * @param res - The Express response object
   * @returns A promise that resolves when the Task is deleted
   */
  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.deleteTaskUseCase.execute(req.params.TaskId);
      if(result)res.status(204).send();
      else res.status(404).send();
    } catch (error) {
      httpRequestErrorHandler(res, error);
    }
  }
}