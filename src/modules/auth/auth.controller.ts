import { Response, Request, NextFunction } from 'express';
import { Respond } from '../../lib/Repond';
import { AuthService } from './auth.services';
import { IUserInput } from '../../types/payloads/user-create';

export const authController = {
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: IUserInput = req.body;
      const tokens = await AuthService.createUser(
        payload.username,
        payload.fullname,
        payload.email,
        payload.password,
        'CREDENTIAL',
      );

      res.cookie('accessToken', tokens.accessToken, {
        maxAge: 300000, // 5 minutes
        httpOnly: true,
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 3.154e10, // 1 year
        httpOnly: true,
      });

      return Respond({ res, status: 200, data: { message: 'User Created SuccessFully.' } });
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  },
  loginUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { emailOrUsername, password } = req.body;
      const tokens = await AuthService.loginUser(emailOrUsername, password);

      res.cookie('accessToken', tokens.accessToken, {
        maxAge: 300000, // 5 minutes
        httpOnly: true,
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 3.154e10, // 1 year
        httpOnly: true,
      });

      return Respond({ res, status: 200, data: { message: 'User Logged In SuccessFully.' } });
    } catch (error) {
      next(error);
    }
  },
  identifyMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-expect-error: User not authenticated, handling in middleware
      const user = req.user;
      return Respond({ res, status: 200, data: { ...user } });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-expect-error: User not authenticated, handling in middleware
      await AuthService.invalidateSession(req.user.sessionId);

      res.cookie('accessToken', '', {
        maxAge: 0,
        httpOnly: true,
      });

      res.cookie('refreshToken', '', {
        maxAge: 0,
        httpOnly: true,
      });

      return Respond({ res, status: 200, data: { message: 'User Logged Out SuccessFully.' } });
    } catch (error) {
      next(error);
    }
  },
};
