import jwt, {
  type JwtPayload,
  type SignOptions,
  type VerifyOptions,
} from "jsonwebtoken";

import { env } from "../config/env.js";

export type AccessTokenPayload = JwtPayload & {
  sub: string;
  type: "access";
};

type TokenOptions = {
  secret?: string;
  expiresIn?: SignOptions["expiresIn"];
};

const jwtExpiresIn = env.ACCESS_TOKEN_TTL as SignOptions["expiresIn"];

/**
 * Sign an access JWT.
 *
 * @param payload
 * Token payload.
 *
 * @param options
 * Optional JWT signing configuration.
 *
 * @returns Signed access token.
 */
export function signAccessToken(
  payload: Omit<AccessTokenPayload, "iat" | "exp">,
  options: TokenOptions = {},
): string {
  const { secret = env.JWT_SECRET, expiresIn = jwtExpiresIn } = options;

  return jwt.sign(payload, secret, {
    expiresIn,
  });
}

/**
 * Verify and decode an access JWT.
 *
 * @param token
 * Access token to verify.
 *
 * @param options
 * Optional JWT verification configuration.
 *
 * @returns Decoded access token payload.
 *
 * @throws {JsonWebTokenError|TokenExpiredError}
 * If the token is invalid or expired.
 */
export function verifyAccessToken(
  token: string,
  options: {
    secret?: string;
    verifyOptions?: VerifyOptions;
  } = {},
): AccessTokenPayload {
  const { secret = env.JWT_SECRET, verifyOptions = {} } = options;

  const payload = jwt.verify(token, secret, verifyOptions);

  if (typeof payload === "string") {
    throw new Error("Invalid access token.");
  }

  const jwtPayload = payload as JwtPayload;

  if (typeof jwtPayload.sub !== "string" || jwtPayload.type !== "access") {
    throw new Error("Invalid access token.");
  }

  return jwtPayload as AccessTokenPayload;
}
