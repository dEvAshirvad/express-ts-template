import express from 'express';
const authRouter = express.Router();
import { authController } from './auth.controller';
import { upload } from '../../config/multerConfig';
import { requireUser } from '../../middlewares/authenticate';

authRouter.post('/signup', upload.single('file'), authController.createUser);
authRouter.get('/signin', upload.none(), authController.loginUser);
authRouter.get('/me', upload.none(), requireUser, authController.identifyMe);
authRouter.get('/logout', upload.none(), requireUser, authController.logout);

export default authRouter;
