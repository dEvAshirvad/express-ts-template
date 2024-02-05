import { NextFunction, Request, Response } from 'express';
import { APIError } from '../errors/APIError';
import USER_ERRORS from '../errors/userAuthError';
import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV}` });

export async function xApiValidator(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.header('x-api-key');

  if (!apiKey && apiKey !== process.env.xApiKey) {
    return next(new APIError(USER_ERRORS.AUTHORIZATION_ERROR));
  }

  next();
}
