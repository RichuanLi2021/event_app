import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/signup', authController.signup); 
authRouter.post('/sign-in', authController.signIn);
authRouter.post('/logout', authController.logout);
authRouter.post('/refresh-token', authController.refreshToken);
authRouter.post('/reset-password', authController.resetPassword);

export default authRouter;