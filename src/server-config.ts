import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import IHttpResponse from './types/http-response';
import { xApiValidator } from './middlewares/authenticate';
import { errorHandler } from './middlewares/errorHandler';
const timestamp = new Date().toISOString();

export function serverConfig(app: Express) {
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true, limit: '2048mb' }));
  app.use(express.json({ limit: '2048mb' }));
  app.use(cors());

  app.route('/api-status').get((req, res) => {
    res.status(200).json({
      title: 'API is running',
      success: true,
      message: `API Services are active`,
      status: 200,
      timestamp: timestamp,
    } satisfies IHttpResponse);
  });

  app.use('/api/v1', xApiValidator);

  app.use(errorHandler);
}
