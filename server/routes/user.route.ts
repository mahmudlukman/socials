import express from 'express';
import {
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth';
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/activate-user', activateUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout', logoutUser);
userRouter.get('/me', isAuthenticated, getUserInfo);

export default userRouter;
