import {
  signAccessToken,
  verifyAccessToken,
  type AccessTokenPayload,
} from "../../../utils/jwt.js";

import TokenStrategy from "../token.strategy.js";

type AuthenticatedUser = {
  _id: string | { toString(): string };
};

/**
 * JWT authentication strategy.
 *
 * Responsible for creating and verifying access tokens.
 * Token transport (Bearer header, cookie, etc.) is handled separately.
 */
class JwtStrategy extends TokenStrategy {
  /**
   * Create an access token for an authenticated user.
   *
   * @param user
   * Authenticated user.
   *
   * @returns Authentication credentials containing an access token.
   */
  issue(user: AuthenticatedUser): {
    accessToken: string;
  } {
    const accessToken = signAccessToken({
      sub: user._id.toString(),
      type: "access",
    });

    return {
      accessToken,
    };
  }

  /**
   * Verify an access token.
   *
   * @param token
   * Access token to verify.
   *
   * @returns Decoded access token payload.
   *
   * @throws {JsonWebTokenError|TokenExpiredError}
   * If the token is invalid or expired.
   */
  verifyAccessToken(token: string): AccessTokenPayload {
    return verifyAccessToken(token);
  }
}

export default new JwtStrategy();
