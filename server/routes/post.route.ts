import express from 'express';
import {
  createPost,
  getAllPosts,
  updateLikes,
} from '../controllers/post.controller';
import { isAuthenticated } from '../middleware/auth';
const postRouter = express.Router();

postRouter.post('/create', isAuthenticated, createPost);
postRouter.get('/get-posts', isAuthenticated, getAllPosts);
postRouter.put('/update-likes', isAuthenticated, updateLikes);

export default postRouter;
