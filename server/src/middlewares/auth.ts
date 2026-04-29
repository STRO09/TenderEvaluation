import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken, type AuthRole } from "../utils/jwt";
import { ACCESS_COOKIE } from "../utils/cookies";
import { Forbidden, Unauthorized } from "../utils/errors";

export function verifyJWT(req: Request, _res: Response, next: NextFunction): void {
  const fromCookie = req.cookies?.[ACCESS_COOKIE] as string | undefined;
  const auth = req.headers.authorization;
  const fromHeader = auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length) : undefined;
  const token = fromCookie ?? fromHeader;
  if (!token) {
    return next(Unauthorized("Missing access token"));
  }
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(Unauthorized("Invalid or expired access token"));
  }
}

export function requireRole(...roles: AuthRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(Unauthorized());
    if (!roles.includes(req.user.role)) return next(Forbidden(`Requires role: ${roles.join(" or ")}`));
    next();
  };
}
