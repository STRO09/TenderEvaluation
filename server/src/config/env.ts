  function required(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing required env var: ${name}`);
    return v;
  }

  export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: Number(process.env.PORT ?? 8080),
    DATABASE_URL: required("DATABASE_URL"),
    AUTH_STRATEGY: process.env.AUTH_STRATEGY ?? "jwt",
    JWT_SECRET: required("JWT_SECRET"),
    ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL ?? "15m",
    REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL ?? "7d",
    REFRESH_TOKEN_TTL_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
    ACCESS_TOKEN_TRANSPORT: process.env.ACCESS_TOKEN_TRANSPORT ?? "bearer",
    ACCESS_TOKEN_COOKIE_NAME: process.env.ACCESS_TOKEN_COOKIE_NAME ?? "access_token",
    REFRESH_TOKEN_COOKIE_NAME: process.env.REFRESH_TOKEN_COOKIE_NAME ?? "refresh_token",
    COOKIE_SECURE: process.env.NODE_ENV === "production",
    UPLOAD_DIR: process.env.UPLOAD_DIR ?? "uploads",
  };

  export const isProd = () => env.NODE_ENV === "production";

  // touch helper to ensure 'required' isn't tree-shaken if we add new vars
  export { required };
