import express from 'express';
import {
  deleteUser,
  followUnfollowUser,
  getAllUsers,
  // getNotification,
  // getUserFriends,
  getUserInfo,
  updateCoverPicture,
  updatePassword,
  updateProfilePicture,
  updateUserInfo,
  updateUserStatus,
} from '../controllers/user.controller';
import { isAuthenticated, authorizeRoles } from '../middleware/auth';
import { getNotifications } from '../controllers/notification.controller';
const userRouter = express.Router();

userRouter.get('/me', isAuthenticated, getUserInfo);
userRouter.put('/update-user', isAuthenticated, updateUserInfo);
userRouter.put(
  '/update-profile-picture',
  isAuthenticated,
  updateProfilePicture
);
userRouter.put('/update-cover-picture', isAuthenticated, updateCoverPicture);
userRouter.get('/get-notifications', isAuthenticated, getNotifications);
userRouter.put('/follow-unfollow', isAuthenticated, followUnfollowUser);
userRouter.get(
  '/get-users',
  isAuthenticated,
  authorizeRoles('admin'),
  getAllUsers
);
userRouter.put('/update-password', isAuthenticated, updatePassword);
userRouter.put(
  '/update-user-status/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  updateUserStatus
);

userRouter.delete(
  '/delete-user/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  deleteUser
);

export default userRouter;
