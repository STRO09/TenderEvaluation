import crypto from "crypto";

/**
 * Generate a cryptographically secure opaque refresh token.
 *
 * @returns Random refresh token.
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

/**
 * Hash a refresh token before storing or looking it up.
 *
 * The plaintext refresh token should never be persisted.
 *
 * @param token
 * Plaintext refresh token.
 *
 * @returns SHA-256 hash of the refresh token.
 */
export function hashRefreshToken(token: string): string {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}