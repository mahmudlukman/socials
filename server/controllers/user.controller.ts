require('dotenv').config();
import UserModel, { IUser } from '../models/User';
import ErrorHandler from '../utils/errorHandler';
import { catchAsyncError } from '../middleware/catchAsyncError';
import { NextFunction, Request, Response } from 'express';
import cloudinary from 'cloudinary';
import Notification from '../models/Notification';

// get user info
export const getUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const user = await UserModel.findById(userId).select('-password');
      res.status(200).json({ success: true, user });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user info
interface IUpdateUserInfo {
  name?: string;
  userName?: string;
  bio?: string;
}

// update user info
export const updateUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, userName, bio } = req.body as IUpdateUserInfo;
      const userId = req.user?._id;
      const user = await UserModel.findById(userId);

      if (!user) {
        return next(new ErrorHandler('User not found', 400));
      }

      if (name) user.name = name;
      if (userName) user.userName = userName;
      if (bio) user.bio = bio;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        if (error.keyValue.userName) {
          return next(new ErrorHandler('Username already exists', 400));
        }
      }
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user profile picture
interface IUpdateProfilePicture {
  profilePicture: string;
}

export const updateProfilePicture = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { profilePicture } = req.body as IUpdateProfilePicture;

      const userId = req.user?._id;

      const user = await UserModel.findById(userId);

      if (profilePicture && user) {
        // if user have one avatar then call this if
        if (user?.profilePicture?.public_id) {
          // first delete the old image
          await cloudinary.v2.uploader.destroy(user?.profilePicture?.public_id);

          const myCloud = await cloudinary.v2.uploader.upload(profilePicture, {
            folder: 'profilePictures',
            width: 150,
          });
          user.profilePicture = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          const myCloud = await cloudinary.v2.uploader.upload(profilePicture, {
            folder: 'profilePictures',
            width: 150,
          });
          user.profilePicture = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      await user?.save();

      res.status(200).json({ success: true, user });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user profile picture
interface IUpdateCoverPicture {
  coverPicture: string;
}

export const updateCoverPicture = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { coverPicture } = req.body as IUpdateCoverPicture;

      const userId = req.user?._id;

      const user = await UserModel.findById(userId);

      if (coverPicture && user) {
        if (user?.coverPicture?.public_id) {
          await cloudinary.v2.uploader.destroy(user?.coverPicture?.public_id);

          const myCloud = await cloudinary.v2.uploader.upload(coverPicture, {
            folder: 'coverPictures',
            width: 150,
          });
          user.coverPicture = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          const myCloud = await cloudinary.v2.uploader.upload(coverPicture, {
            folder: 'coverPictures',
            width: 150,
          });
          user.coverPicture = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      await user?.save();

      res.status(200).json({ success: true, user });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Follow and unfollow user
export const followUnfollowUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loggedInUser = req.user;
      const { followUserId } = req.body;

      const isFollowedBefore = loggedInUser.following.find(
        (item: { userId: any }) => item.userId === followUserId
      );
      const loggedInUserId = loggedInUser._id;

      if (isFollowedBefore) {
        await UserModel.updateOne(
          { _id: followUserId },
          { $pull: { followers: { userId: loggedInUserId } } }
        );

        await UserModel.updateOne(
          { _id: loggedInUserId },
          { $pull: { following: { userId: followUserId } } }
        );

        await Notification.deleteOne({
          'creator._id': loggedInUserId,
          userId: followUserId,
          type: 'Follow',
        });

        res.status(200).json({
          success: true,
          message: 'User unfollowed successfully',
        });
      } else {
        await UserModel.updateOne(
          { _id: followUserId },
          { $push: { followers: { userId: loggedInUserId } } }
        );

        await UserModel.updateOne(
          { _id: loggedInUserId },
          { $push: { following: { userId: followUserId } } }
        );

        await Notification.create({
          creator: req.user,
          type: 'Follow',
          title: 'Followed you',
          userId: followUserId,
        });

        res.status(200).json({
          success: true,
          message: 'User followed successfully',
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all users --- only for admin
export const getAllUsers = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserModel.find().sort({ created: -1 });
      res.status(201).json({ success: true, users });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get user notification
// export const getNotification = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const notifications = await Notification.find({
//         userId: req.user.id,
//       }).sort({ createdAt: -1 });

//       res.status(201).json({
//         success: true,
//         notifications,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 401));
//     }
//   }
// );

// update user password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler('Please enter old and new password', 400));
      }

      const user = await UserModel.findById(req.user?._id).select('+password');

      if (user?.password === undefined) {
        return next(new ErrorHandler('Invalid user', 400));
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler('Invalid old password', 400));
      }

      user.password = newPassword;

      await user.save();

      res.status(201).json({ success: true, user });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user status --- only for admin
export const updateUserStatus = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, active } = req.body;
      const { id } = req.params;
      // const userId = req.user?._id;
      const user = await UserModel.findById(id);

      if (!user) {
        return next(new ErrorHandler('User not found', 400));
      }

      if (role) user.role = role;
      if (active) user.active = active;

      await user.save();

      res.status(201).json({ success: true, user });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Delete user --- only for admin
export const deleteUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await UserModel.findById(id);

      if (!user) {
        return next(new ErrorHandler('User not found', 404));
      }

      await user.deleteOne({ id });

      res
        .status(200)
        .json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
