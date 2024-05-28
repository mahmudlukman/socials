import express from 'express';
import { createPost } from '../controllers/post.controller';
import { isAuthenticated } from '../middleware/auth';
const postRouter = express.Router();

postRouter.post('/create', isAuthenticated, createPost);

export default postRouter;
