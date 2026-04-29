import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { setAuthCookies, clearAuthCookies, REFRESH_COOKIE } from "../utils/cookies";
import {
  registerUser,
  loginUser,
  rotateRefreshToken,
  logoutUser,
  getMe,
} from "../services/auth.service";
import type { RegisterDto, LoginDto } from "../validators/auth.schema";
import { Unauthorized } from "../utils/errors";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as RegisterDto;
  const user = await registerUser(body);
  res.status(201).json({ user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as LoginDto;
  const { accessToken, refreshToken, user } = await loginUser(body);
  setAuthCookies(res, accessToken, refreshToken);
  res.json({ user });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;
  if (!token) throw Unauthorized("Missing refresh token");
  const { accessToken, refreshToken: newRefresh, user } = await rotateRefreshToken(token);
  setAuthCookies(res, accessToken, newRefresh);
  res.json({ user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;
  await logoutUser(token);
  clearAuthCookies(res);
  res.json({ ok: true });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw Unauthorized();
  const user = await getMe(req.user.sub);
  res.json({ user });
});
