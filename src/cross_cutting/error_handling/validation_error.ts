import { AppError } from './app_error';

export class ValidationError extends AppError {
  errors: Record<string, string>;

  constructor(errors: Record<string, string>) {
    super('Validation Error', 400);
    this.errors = errors;
  }
}

export const createValidationError = (errors: Record<string, string>) => {
  return new ValidationError(errors);
};