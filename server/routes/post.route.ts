import express from 'express';
import {
 
} from '../controllers/post.controller';
import { isAuthenticated } from '../middleware/auth';
const postRouter = express.Router();

// postRouter.post('/register', registerUser);

export default postRouter;
