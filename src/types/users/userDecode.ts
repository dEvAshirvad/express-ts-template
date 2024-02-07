import { ObjectId } from 'mongoose';

export interface IUserJWTDecode {
  username: string;
  account_id: string;
  fullname: string;
  email: string;
  imageUrl: string;
  role: string;
  sessionId: ObjectId | undefined;
  emailVerified: boolean;
}
