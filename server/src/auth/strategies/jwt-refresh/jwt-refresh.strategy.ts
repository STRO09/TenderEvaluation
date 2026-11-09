import {
  signAccessToken,
  verifyAccessToken as verifyAccessTokenJwt,
  type AccessTokenPayload,
} from "../../../utils/jwt.js";

import {
  generateRefreshToken,
  hashRefreshToken,
} from "../../../utils/refreshToken.js";

import repositories from "../../../db/provider.js";

import TokenStrategy from "../token.strategy.js";

import env from "../../../config/env.js";
import ApiError from "../../../utils/ApiError.js";
import logger from "../../../utils/logger.js";
import { parseDuration } from "../../../utils/DateTimeFormat.js";

const { refreshSession: refreshSessionRepository } = repositories;

type AuthenticatedUser = {
  _id: string | { toString(): string };
};

type SessionContext = {
  ipAddress?: string;
  userAgent?: string;
};

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

/**
 * JWT authentication strategy with refresh-token sessions.
 *
 * Access tokens are stateless JWTs. Refresh tokens are opaque
 * credentials whose hashes are persisted as refresh sessions.
 */
class JwtRefreshStrategy extends TokenStrategy {
  /**
   * Issue access and refresh credentials for a user.
   *
   * Creates a persisted refresh session while returning the
   * plaintext refresh token to the client.
   *
   * @param user
   * Authenticated user.
   *
   * @param context
   * Session metadata.
   *
   * @returns Access and refresh credentials.
   */
  async issue(
    user: AuthenticatedUser,
    context: SessionContext = {},
  ): Promise<TokenPair> {
    const userId = user._id.toString();

    const accessToken = signAccessToken({
      sub: userId,
      type: "access",
    });

    const refreshToken = generateRefreshToken();

    const tokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date(
      Date.now() + parseDuration(env.REFRESH_EXPIRES_IN),
    );

    await refreshSessionRepository.create({
      userId: user._id,
      tokenHash,
      expiresAt,
      ipAddress: context.ipAddress ?? null,
      userAgent: context.userAgent ?? null,
    });

    logger.debug("Refresh session created.", {
      userId,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Verify an access token.
   *
   * @param token
   * Access token.
   *
   * @returns Decoded access token payload.
   */
  verifyAccessToken(token: string): AccessTokenPayload {
    return verifyAccessTokenJwt(token);
  }

  /**
   * Rotate a refresh token.
   *
   * The existing refresh session is revoked and a new refresh
   * session is created.
   *
   * @param refreshToken
   * Plaintext refresh token supplied by the client.
   *
   * @param context
   * Session metadata.
   *
   * @returns New access and refresh credentials.
   *
   * @throws {ApiError}
   * If the refresh token is invalid, expired, or revoked.
   */
  async refresh(
    refreshToken: string,
    context: SessionContext = {},
  ): Promise<TokenPair> {
    const tokenHash = hashRefreshToken(refreshToken);

    const session = await refreshSessionRepository.findByTokenHash(tokenHash);

    if (!session) {
      throw new ApiError({
        statusCode: 401,
        message: "Invalid refresh token.",
      });
    }

    if (session.revokedAt) {
      throw new ApiError({
        statusCode: 401,
        message: "Refresh token has been revoked.",
      });
    }

    if (session.expiresAt <= new Date()) {
      throw new ApiError({
        statusCode: 401,
        message: "Refresh token has expired.",
      });
    }

    const revokedSession = await refreshSessionRepository.revokeIfActive(
      session._id,
    );

    if (!revokedSession) {
      throw new ApiError({
        statusCode: 401,
        message: "Refresh token has been revoked.",
      });
    }

    return this.issue(
      {
        _id: session.userId,
      },
      context,
    );
  }
}

export default new JwtRefreshStrategy();
