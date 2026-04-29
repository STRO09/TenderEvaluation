import type { Request } from "express";
import { BadRequest } from "./errors";

export function param(req: Request, name: string): string {
  const v = req.params[name];
  if (typeof v !== "string" || v.length === 0) {
    throw BadRequest(`Missing or invalid path parameter: ${name}`);
  }
  return v;
}
