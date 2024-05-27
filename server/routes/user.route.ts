import express from 'express';
import {
  addRemoveFriend,
  deleteUser,
  getAllUsers,
  getUserFriends,
  getUserInfo,
  updateCoverPicture,
  updatePassword,
  updateProfilePicture,
  updateUserInfo,
  updateUserStatus,
} from '../controllers/user.controller';
import { isAuthenticated, authorizeRoles } from '../middleware/auth';
const userRouter = express.Router();

userRouter.get('/me', isAuthenticated, getUserInfo);
userRouter.put('/update-user', isAuthenticated, updateUserInfo);
userRouter.put(
  '/update-profile-picture',
  isAuthenticated,
  updateProfilePicture
);
userRouter.put('/update-cover-picture', isAuthenticated, updateCoverPicture);
userRouter.get('/friends/:id', isAuthenticated, getUserFriends);
userRouter.put('/add-remove/:id/:friendId', isAuthenticated, addRemoveFriend);
userRouter.get(
  '/get-users',
  isAuthenticated,
  authorizeRoles('admin'),
  getAllUsers
);
userRouter.put('/update-password', isAuthenticated, updatePassword);
userRouter.put(
  '/update-user-status',
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
