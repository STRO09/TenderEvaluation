import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export type AuthRole = "government" | "company";

export interface AccessPayload {
  sub: string; // user id
  role: AuthRole;
  email: string;
}

export interface RefreshPayload {
  sub: string;
  jti: string; // refresh token id
}

export function signAccessToken(payload: AccessPayload): string {
  const opts: SignOptions = { expiresIn: env.ACCESS_TOKEN_TTL as SignOptions["expiresIn"] };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, opts);
}

export function signRefreshToken(payload: RefreshPayload): string {
  const opts: SignOptions = { expiresIn: env.REFRESH_TOKEN_TTL as SignOptions["expiresIn"] };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, opts);
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
}

export function verifyRefreshToken(token: string): RefreshPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload;
}
