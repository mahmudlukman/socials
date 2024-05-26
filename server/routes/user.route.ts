import express from 'express';
import {
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
  updateUserInfo,
} from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth';
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/activate-user', activateUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout', isAuthenticated, logoutUser);
userRouter.get('/me', isAuthenticated, getUserInfo);
userRouter.put('/update-user', isAuthenticated, updateUserInfo);

export default userRouter;
