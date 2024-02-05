import express from 'express';
import dotenv from 'dotenv';
import { serverConfig } from './server-config';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();
const PORT = process.env.PORT || 3030;

serverConfig(app);

const server = app.listen(PORT, () => {
  console.log('Running Status', `Server started on port http://localhost:${PORT}`);
});

process.on('unhandledRejection', () => {
  // Logger.critical('Unhandled rejection', err);
  server.close(() => process.exit(1));
});
