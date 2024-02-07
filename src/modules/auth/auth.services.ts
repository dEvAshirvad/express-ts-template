import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IAccount, ISession, IUser, accountModal, sessionModal, userModal } from './auth.modal';
import { config } from 'dotenv';
import { APIError } from '../../errors/APIError';
import USER_ERRORS from '../../errors/userAuthError';
import ACCOUNT_ERROR from '../../errors/accountAuthErrors';
import { BSON } from 'bson';
import MONGO_ERRORS from '../../errors/mongoErrors';
import JWT_ERRORS from '../../errors/jwtErrors';
import { IUserJWTDecode } from '../../types/users/userDecode';
import { ObjectId } from 'mongoose';

config({ path: `.env.${process.env.NODE_ENV}` });

export class AuthService {
  static async userExist(email: string, username: string): Promise<void> {
    const existingUser = await userModal.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new APIError(USER_ERRORS.USER_ALREADY_EXISTS);
    }
  }

  private static async generateTokens(
    user: IUser,
    accountType: string = '',
    userId: string | null = null,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    console.log(userId);

    const result: IAccount | null =
      accountType === ''
        ? await accountModal.findOne({ userId })
        : await this.createAccount(user._id.toString(), accountType, user.role, user);

    const sessionId: ISession | null = userId
      ? await this.createSession(userId, {
          username: user.username,
          account_id: result?._id.toString(),
          fullname: user.fullname,
          email: user.email,
          imageUrl: user.imageUrl,
          role: user.role,
          emailVerified: user.emailVerified,
        })
      : null;

    if (!result) {
      throw new APIError(ACCOUNT_ERROR.ACCOUNT_NOT_FOUND);
    }

    const jwtPayload: IUserJWTDecode = {
      username: user.username,
      account_id: result?._id.toString(), // Placeholder for the account's ID
      fullname: user.fullname,
      email: user.email,
      imageUrl: user.imageUrl,
      role: user.role,
      sessionId: sessionId?._id,
      emailVerified: user.emailVerified,
    };

    const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: '5s',
    });
    const refreshToken = jwt.sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: '1y',
    });

    if (!userId) {
      await this.updateAccount(result?._id, {
        access_token: accessToken,
        refresh_token: refreshToken,
        updatedAt: new Date(),
      });
    }

    return { accessToken, refreshToken };
  }

  private static async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  public static async createAccount(
    userId: string,
    accountType: string,
    scope: string,
    user: IUser,
  ): Promise<IAccount> {
    try {
      // Check if the account already exists
      const existingAccount = await accountModal.findOne({ userId, accountType });
      if (existingAccount) {
        throw new APIError(ACCOUNT_ERROR.ACCOUNT_ALREADY_EXISTS);
      }

      // Create the new account
      const newAccount: IAccount = new accountModal({
        _id: new BSON.ObjectId(),
        userId,
        accountType,
        scope,
      });

      await newAccount.save();

      await this.createSession(userId, {
        account_id: newAccount._id.toString(),
        email: user.email,
        emailVerified: user.emailVerified,
        fullname: user.fullname,
        imageUrl: user.imageUrl || 'image',
        role: user.role,
        username: user.username,
      });

      return newAccount;
    } catch (error: any) {
      if (error.name === 'MongoError') {
        console.log(error.code);

        switch (error.code) {
          case 11000:
            // Handle duplicate key error
            throw new APIError(MONGO_ERRORS.DUPLICATE_KEY_ERROR);
          default:
            // Handle other MongoDB errors
            throw new APIError(MONGO_ERRORS.INTERNAL_SERVER_ERROR);
        }
      } else {
        throw error;
      }
    }
  }

  public static async updateAccount(
    accountId: ObjectId | undefined,
    updates: Partial<IAccount>,
  ): Promise<IAccount> {
    try {
      // Update the account with the provided details
      const updatedAccount = await accountModal.findByIdAndUpdate(
        accountId,
        { $set: updates },
        { new: true },
      );

      if (!updatedAccount) {
        throw new APIError(ACCOUNT_ERROR.ACCOUNT_NOT_FOUND);
      }

      return updatedAccount;
    } catch (error: any) {
      if (error.name === 'MongoError') {
        console.log(error.code);

        switch (error.code) {
          case 11000:
            // Handle duplicate key error
            throw new APIError(MONGO_ERRORS.DUPLICATE_KEY_ERROR);
          default:
            // Handle other MongoDB errors
            throw new APIError(MONGO_ERRORS.INTERNAL_SERVER_ERROR);
        }
      } else {
        throw error;
      }
    }
  }

  public static async createUser(
    username: string,
    fullname: string,
    email: string,
    password: string,
    accountType: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Check if the user already exists
      await this.userExist(email, username);

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user
      const newUser: IUser = new userModal({
        _id: new BSON.ObjectId(),
        username,
        fullname,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      // Generate access and refresh tokens
      const tokens = await this.generateTokens(newUser, accountType, newUser._id.toString());

      return tokens;
    } catch (error: any) {
      if (error.name === 'MongoServerError') {
        switch (error.code) {
          case 11000:
            // Handle duplicate key error
            throw new APIError(MONGO_ERRORS.DUPLICATE_KEY_ERROR);
          default:
            // Handle other MongoDB errors
            throw new APIError(MONGO_ERRORS.INTERNAL_SERVER_ERROR);
        }
      } else {
        throw error;
      }
    }
  }

  public static decodeJWT(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;

      if (!decoded) {
        throw new APIError(JWT_ERRORS.JWT_INVALID); // Throw ApiError for invalid token
      }

      // Check token expiry
      if (decoded.exp) {
        const expiryDate = new Date(decoded.exp * 1000); // Convert to milliseconds

        const now = new Date();
        if (now > expiryDate) {
          throw new APIError(JWT_ERRORS.JWT_EXPIRED); // Throw ApiError for expired token
        }
      }

      // Perform other checks if needed

      return decoded;
    } catch (err) {
      throw new APIError(JWT_ERRORS.JWT_VERIFICATION_FAILED); // Throw ApiError for JWT verification failure
    }
  }

  public static async loginUser(
    emailOrUsername: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await userModal.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    const account = await accountModal.findOne({
      userId: user?._id.toString(),
    });
    if (!user || !(await this.comparePasswords(password, user.password))) {
      throw new APIError(USER_ERRORS.INVALID_CREDENTIALS);
    }

    const { accessToken, refreshToken } = await this.generateTokens(user, '', user._id.toString());
    await this.updateAccount(account?._id, {
      access_token: accessToken,
      refresh_token: refreshToken,
      updatedAt: new Date(),
    });
    return { accessToken, refreshToken };
  }

  public static async getSession(useremail: string): Promise<ISession | null> {
    try {
      // Find the user details using the userId from the account
      const session = (await sessionModal.findOne({ 'user.email': useremail }))?.toObject();

      if (!session) {
        // Handle case where user with the userId from the account is not found
        return null;
      }

      // Return user details
      return session;
    } catch (error) {
      // Handle errors
      console.error('Error while fetching user details:', error);
      throw error;
    }
  }

  public static async getSessionId(useremail: string): Promise<ObjectId | null> {
    try {
      // Find the user details using the userId from the account
      const session = (await sessionModal.findOne({ 'user.email': useremail }))?.toObject();

      if (!session) {
        // Handle case where user with the userId from the account is not found
        return null;
      }

      // Return user details
      return session._id;
    } catch (error) {
      // Handle errors
      console.error('Error while fetching user details:', error);
      throw error;
    }
  }

  public static async createSession(
    userId: string,
    user: Record<string, string | boolean | undefined>,
  ): Promise<ISession> {
    try {
      const existingSession = await sessionModal.findOneAndUpdate(
        { userId, valid: true },
        { $set: { updatedAt: new Date() } },
        { new: true },
      );
      if (existingSession) {
        return existingSession.toObject();
      }

      const sessionData = {
        _id: new BSON.ObjectId(),
        userId: userId,
        user: user,
      };

      // Create the session document
      const session = (await sessionModal.create(sessionData)).toObject();

      // Return the plain JavaScript object
      return session;
    } catch (error) {
      // Handle errors
      console.error('Error while creating session:', error);
      throw error;
    }
  }

  public static async invalidateSession(sessionId: string) {
    const updateSession = await sessionModal.findOneAndUpdate(
      { _id: sessionId, valid: true },
      {
        valid: false,
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (!updateSession) {
      throw new APIError({ MESSAGE: 'session not exist', STATUS: 404, TITLE: 'SESSION NOT FOUND' });
    }
  }
}
