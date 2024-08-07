import express from 'express';
import {
  addReplies,
  addReply,
  createPost,
  deletePost,
  getAllPosts,
  // getAllUserPosts,
  getUserPosts,
  singlePost,
  updateLikes,
  updateRepliesReplyLike,
  updateReplyLikes,
} from '../controllers/post.controller';
import { isAuthenticated } from '../middleware/auth';
const postRouter = express.Router();

postRouter.post('/create', isAuthenticated, createPost);
postRouter.get('/get-posts', isAuthenticated, getAllPosts);
postRouter.get('/get-user-posts/:userId', isAuthenticated, getUserPosts);
postRouter.get('/get-post/:postId', isAuthenticated, singlePost);
// postRouter.get('/get-user-posts/:id', isAuthenticated, getAllUserPosts);
postRouter.put('/update-likes', isAuthenticated, updateLikes);
postRouter.put('/add-replies', isAuthenticated, addReplies);
postRouter.put('/add-reply', isAuthenticated, addReply);
postRouter.put('/update-replies-react', isAuthenticated, updateReplyLikes);
postRouter.put('/update-reply-react', isAuthenticated, updateRepliesReplyLike);
postRouter.delete('/delete/:id', isAuthenticated, deletePost);
export default postRouter;
