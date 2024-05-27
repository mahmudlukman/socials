import express from 'express';
import {
  activateUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/auth.controller';
import { isAuthenticated } from '../middleware/auth';
const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/activate-user', activateUser);
authRouter.post('/login', loginUser);
authRouter.get('/logout', isAuthenticated, logoutUser);

export default authRouter;
