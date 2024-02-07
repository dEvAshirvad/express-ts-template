import { NextFunction, Request, Response } from 'express';

import { config } from 'dotenv';
import { signJWT, verifyJWT } from '../lib/jwt.util';
import { AuthService } from '../modules/auth/auth.services';
import { APIError } from '../errors/APIError';
import mongoose from 'mongoose';
config({ path: `.env.${process.env.NODE_ENV}` });

async function deserializeUser(req: Request, res: Response, next: NextFunction) {
  const { accessToken, refreshToken } = req.cookies;
  if (!accessToken) {
    return next();
  }
  const { payload, expired } = verifyJWT(accessToken, process.env.ACCESS_TOKEN_SECRET as string);

  // For a valid access token
  if (payload) {
    // @ts-expect-error: User not authenticated, handling in middleware
    req.user = payload;
    return next();
  }

  // expired but valid access token
  const { payload: refresh, expired: refresh_expiry } =
    expired && refreshToken
      ? verifyJWT(refreshToken, process.env.REFRESH_TOKEN_SECRET as string)
      : { payload: null, expired: false };

  if (refresh_expiry) {
    throw new APIError({
      MESSAGE: 'need to relogin because refresh token expired',
      STATUS: 401,
      TITLE: 'NEED TO RELOGIN',
    });
  }

  if (!refresh) {
    return next();
  }
  // @ts-expect-error: Refresh token may not have email
  const session = await AuthService.getSession(refresh.email);
  if (!session) {
    return next();
  }
  try {
    const newAccessToken = signJWT(
      { ...session.user, sessionId: session._id.toString() },
      '5s',
      process.env.ACCESS_TOKEN_SECRET as string,
    );

    res.cookie('accessToken', newAccessToken, {
      maxAge: 300000, // 5 minutes
      httpOnly: true,
    });

    const payload = verifyJWT(newAccessToken, process.env.ACCESS_TOKEN_SECRET as string).payload;

    // @ts-expect-error: User not authenticated, handling in middleware
    req.user = payload;
    // @ts-expect-error: User not authenticated, handling in middleware
    const accountId = new mongoose.Types.ObjectId(payload.account_id);
    // @ts-expect-error: User not authenticated, handling in middleware
    await AuthService.updateAccount(accountId, {
      access_token: newAccessToken,
      updatedAt: new Date(),
    });
  } catch (error) {
    return next(error);
  }

  return next();
}

export default deserializeUser;
