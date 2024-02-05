import { Response, Request } from 'express';
import { IHttpResponseWithData } from '../../types/http-response';

export const authController = {
  createUser: async (req: Request, res: Response) => {
    const payload = req.body;

    return res.status(200).json({
      message: 'Yo',
      status: 200,
      data: payload,
      success: true,
      title: 'Recieved',
      timestamp: new Date().toISOString(),
    } satisfies IHttpResponseWithData);
  },
};
