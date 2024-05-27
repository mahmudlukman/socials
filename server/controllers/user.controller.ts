require('dotenv').config();
import UserModel, { IUser } from '../models/User';
import ErrorHandler from '../utils/errorHandler';
import { catchAsyncError } from '../middleware/catchAsyncError';
import { NextFunction, Request, Response } from 'express';
import cloudinary from 'cloudinary';

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
  location?: string;
  occupation?: string;
}

// update user info
export const updateUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, location, occupation } = req.body as IUpdateUserInfo;
      const userId = req.user?._id;
      const user = await UserModel.findById(userId);

      if (!user) {
        return next(new ErrorHandler('User not found', 400));
      }

      if (name) user.name = name;
      if (location) user.location = location;
      if (occupation) user.occupation = occupation;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
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
        // if user have one avatar then call this if
        if (user?.coverPicture?.public_id) {
          // first delete the old image
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

// get users friends
export const getUserFriends = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await UserModel.findById(id);
      if (!user) {
        return next(new ErrorHandler('User not found', 404));
      }

      if (!user.friends || user.friends.length === 0) {
        return res.status(200).json([]);
      }

      const friends = await UserModel.find({
        _id: { $in: user.friends },
      }).select('name occupation location profilePicture');

      // Format friends details
      const formattedFriends = friends.map((friend) => ({
        _id: friend._id,
        name: friend.name,
        occupation: friend.occupation,
        location: friend.location,
        profilePicture: friend.profilePicture,
      }));

      res.status(200).json(formattedFriends);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get users friends
export const addRemoveFriend = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, friendId } = req.params;

      const user = await UserModel.findById(id);
      const friend = await UserModel.findById(friendId);

      if (!user || !friend) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.friends.includes(friendId)) {
        user.friends = user.friends.filter((userId) => userId !== friendId);
        friend.friends = friend.friends.filter((userId) => userId !== id);
      } else {
        user.friends.push(friendId);
        friend.friends.push(id);
      }

      await user.save();
      await friend.save();

      const friends = await UserModel.find({
        _id: { $in: user.friends },
      }).select('_id name occupation location picturePath');

      res.status(200).json(friends);
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
      const userId = req.user?._id;
      const user = await UserModel.findById(userId);

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
