import express from 'express';
import { xApiValidator } from '../middlewares/authenticate';
import authRouter from './auth/auth.router';
const router = express.Router();

router.use('/api', xApiValidator);
router.use('/auth', xApiValidator, authRouter);

export default router;
