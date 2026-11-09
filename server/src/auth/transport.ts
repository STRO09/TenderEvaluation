import {env} from "../config/env"

import bearerTransport from "./transports/bearer.transport";
import cookieTransport from "./transports/cookie.transport";

/**
 * Authentication transport registry.
 *
 * Selects how authentication tokens are extracted from incoming
 * HTTP requests.
 *
 * Supported transports:
 * - bearer
 * - cookie
 */
const transports : Record<string, Object> = {
    bearer: bearerTransport,
    cookie: cookieTransport
};

/**
 * Active authentication transport.
 *
 * @throws {Error}
 * If AUTH_TRANSPORT is missing or unsupported.
 */
const authTransport = transports[env.ACCESS_TOKEN_TRANSPORT];

if (!authTransport) {
    throw new Error(
        `Unsupported authentication transport: ${env.ACCESS_TOKEN_TRANSPORT}`
    );
}

export default authTransport;