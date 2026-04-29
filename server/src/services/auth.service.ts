import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable, refreshTokensTable } from "@workspace/db";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { env } from "../config/env";
import { Conflict, Unauthorized } from "../utils/errors";
import { randomUUID } from "node:crypto";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  role: "government" | "company";
  userData?: Record<string, unknown>;
}

export async function registerUser(input: RegisterInput) {
  const existing = await db.select().from(usersTable).where(eq(usersTable.email, input.email)).limit(1);
  if (existing.length > 0) throw Conflict("Email already registered");

  const hashed = await bcrypt.hash(input.password, 10);
  const [user] = await db
    .insert(usersTable)
    .values({
      email: input.email,
      password: hashed,
      role: input.role,
      userData: input.userData ?? {},
    })
    .returning();

  return safeUser(user);
}

export async function loginUser(input: LoginInput) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, input.email)).limit(1);
  if (!user) throw Unauthorized("Invalid email or password");

  const ok = await bcrypt.compare(input.password, user.password);
  if (!ok) throw Unauthorized("Invalid email or password");

  return await issueTokensFor(user.id, user.email, user.role);
}

export async function issueTokensFor(
  userId: string,
  email: string,
  role: "government" | "company",
) {
  const accessToken = signAccessToken({ sub: userId, email, role });
  const jti = randomUUID();
  const refreshToken = signRefreshToken({ sub: userId, jti });

  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_MS);
  await db.insert(refreshTokensTable).values({
    userId,
    token: refreshToken,
    expiresAt,
  });

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  return { accessToken, refreshToken, user: safeUser(user!) };
}

export async function rotateRefreshToken(currentRefreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(currentRefreshToken);
  } catch {
    throw Unauthorized("Invalid refresh token");
  }

  const [stored] = await db
    .select()
    .from(refreshTokensTable)
    .where(eq(refreshTokensTable.token, currentRefreshToken))
    .limit(1);

  if (!stored) throw Unauthorized("Refresh token not recognized");
  if (stored.expiresAt < new Date()) {
    await db.delete(refreshTokensTable).where(eq(refreshTokensTable.id, stored.id));
    throw Unauthorized("Refresh token expired");
  }

  // rotate: delete the old, issue a new pair
  await db.delete(refreshTokensTable).where(eq(refreshTokensTable.id, stored.id));

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.sub)).limit(1);
  if (!user) throw Unauthorized("User not found");

  return await issueTokensFor(user.id, user.email, user.role);
}

export async function logoutUser(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) return;
  await db.delete(refreshTokensTable).where(eq(refreshTokensTable.token, refreshToken));
}

export async function getMe(userId: string) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user) throw Unauthorized();
  return safeUser(user);
}

function safeUser(u: typeof usersTable.$inferSelect) {
  return {
    id: u.id,
    email: u.email,
    role: u.role,
    userData: u.userData,
    createdAt: u.createdAt,
  };
}
