function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 8080),
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? "dev-access-secret-change-me",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret-change-me",
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL ?? "15m",
  REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL ?? "7d",
  REFRESH_TOKEN_TTL_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
  COOKIE_SECURE: process.env.NODE_ENV === "production",
  UPLOAD_DIR: process.env.UPLOAD_DIR ?? "uploads",
};

export const isProd = () => env.NODE_ENV === "production";

// touch helper to ensure 'required' isn't tree-shaken if we add new vars
export { required };
