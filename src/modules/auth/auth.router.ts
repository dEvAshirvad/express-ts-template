import express, { Request } from 'express';
const authRouter = express.Router();
import { authController } from './auth.controller';
import { upload } from '../../config/multerConfig';

authRouter.post('/signup', upload.single('file'), authController.createUser);

export default authRouter;
