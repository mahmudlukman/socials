import express from 'express';
import {
  addReplies,
  createPost,
  getAllPosts,
  updateLikes,
} from '../controllers/post.controller';
import { isAuthenticated } from '../middleware/auth';
const postRouter = express.Router();

postRouter.post('/create', isAuthenticated, createPost);
postRouter.get('/get-posts', isAuthenticated, getAllPosts);
postRouter.put('/update-likes', isAuthenticated, updateLikes);
postRouter.put('/add-replies', isAuthenticated, addReplies);

export default postRouter;
