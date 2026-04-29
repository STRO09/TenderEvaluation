import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny } from "zod";
import { BadRequest } from "../utils/errors";

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(BadRequest("Invalid request body", result.error.issues));
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next(BadRequest("Invalid query parameters", result.error.issues));
    }
    // do not reassign req.query (Express 5 makes it read-only); attach instead
    (req as unknown as { validatedQuery: unknown }).validatedQuery = result.data;
    next();
  };
}
