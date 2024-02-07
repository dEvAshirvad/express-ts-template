import { config } from 'dotenv';
import mongoose from 'mongoose';

config({ path: `.env.${process.env.NODE_ENV}` });

export default function () {
  return new Promise((resolve, reject) => {
    mongoose.set('strictQuery', false);
    mongoose
      .connect(process.env.DB_URL as string)

      .then(() => {
        resolve('Successfully connected to database');
      })
      .catch((error) => {
        reject(error);
      });
  });
}
