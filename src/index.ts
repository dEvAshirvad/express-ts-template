import express from 'express';
import dotenv from 'dotenv';
import { serverConfig } from './server-config';
import connectDB from './config/DB';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();
const PORT = process.env.PORT || 3030;

serverConfig(app);

connectDB()
  .then(() => {
    console.log('Running Status', 'Database connected');
  })
  .catch((err) => {
    console.log('Database Connection Failed', err);
    process.exit();
  });

const server = app.listen(PORT, () => {
  console.log('Running Status', `Server started on port http://localhost:${PORT}`);
});

process.on('unhandledRejection', () => {
  // Logger.critical('Unhandled rejection', err);
  server.close(() => process.exit(1));
});
