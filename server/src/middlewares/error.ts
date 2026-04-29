import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/errors";
import { logger } from "../lib/logger";

// 4-arg signature is required for Express to recognize this as an error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ error: "Internal server error" });
}
