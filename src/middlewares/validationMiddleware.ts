import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validationMiddleware<T>(type: any): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dtoObject = plainToClass(type, req.body);

    const errors: ValidationError[] = await validate(dtoObject);
    if (errors.length > 0) {
      const errorMessages = errors.map((error) =>
        Object.values(error.constraints ?? {}).join(', ')
      ).join(', ');

      res.status(400).json({ error: errorMessages });
    } else {
      next();
    }
  };
}
