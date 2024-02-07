import { config } from 'dotenv';
import mongoose, { Schema, Document, ObjectId } from 'mongoose';

config({ path: `.env.${process.env.NODE_ENV}` });

export enum ROLE {
  SUBSCRIBER = 'SUBSCRIBER',
  ADMIN = 'ADMIN',
  MODS = 'MODS',
}

export interface IUser extends Document {
  _id: ObjectId;
  username: string;
  fullname: string;
  email: string;
  password: string;
  imageUrl: string;
  role: ROLE;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISession extends Document {
  _id: ObjectId;
  userId: string;
  user: {
    username: string;
    account_id: string;
    fullname: string;
    email: string;
    imageUrl: string;
    role: ROLE;
    emailVerified: boolean;
  };
  valid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAccount extends Document {
  _id: ObjectId;
  accountType: string;
  access_token: string;
  refresh_token: string;
  userId: string;
  scope: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    _id: { type: mongoose.Types.ObjectId },
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageUrl: { type: String, default: 'image' }, // Default value for imageUrl
    role: { type: String, default: ROLE.SUBSCRIBER }, // Default value for role
    emailVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
  { strict: false, collection: process.env.tbl_users },
);

const AccountsSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId },
    accountType: String,
    access_token: String,
    refresh_token: String,
    userId: String,
    scope: String,
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
  { strict: false, collection: process.env.tbl_accounts },
);

const SessionSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId },
    userId: { type: String, required: true },
    user: {
      username: { type: String, required: true },
      account_id: { type: String, required: true },
      fullname: { type: String, required: true },
      email: { type: String, required: true },
      imageUrl: { type: String, required: true },
      role: { type: String, required: true },
      emailVerified: { type: Boolean, required: true },
    },
    valid: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
  { strict: false, collection: process.env.tbl_sessions },
);

export const userModal = mongoose.model<IUser>('userModal', UserSchema);
export const accountModal = mongoose.model<IAccount>('accountModal', AccountsSchema);
export const sessionModal = mongoose.model<ISession>('sessionModal', SessionSchema);
