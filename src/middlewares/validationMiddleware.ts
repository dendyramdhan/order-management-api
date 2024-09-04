import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validationMiddleware<T>(type: any): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dtoObject = plainToClass(type, req.body);

    try {
      const errors: ValidationError[] = await validate(dtoObject);

      if (errors.length > 0) {
        const errorMessages = extractValidationErrors(errors);
        res.status(400).json({ error: errorMessages.join(', ') });
      } else {
        next();
      }
    } catch (error) {
      if (error instanceof Error) {
        next(error); // Pass the error to the next middleware with proper type
      } else {
        next(new Error('An unknown error occurred during validation.'));
      }
    }
  };
}

function extractValidationErrors(errors: ValidationError[]): string[] {
  const errorMessages: string[] = [];

  errors.forEach((error) => {
    if (error.constraints) {
      errorMessages.push(...Object.values(error.constraints));
    }

    if (error.children && error.children.length > 0) {
      errorMessages.push(...extractValidationErrors(error.children));
    }
  });

  return errorMessages;
}
