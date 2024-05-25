require('dotenv').config();
import UserModel, { IUser } from '../models/User';
import ErrorHandler from '../utils/errorHandler';
import { catchAsyncError } from '../middleware/catchAsyncError';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import ejs from 'ejs';
import path from 'path';
import sendMail from '../utils/sendMail';
import { accessTokenOptions, sendToken } from '../utils/jwt';
import cloudinary from 'cloudinary';
import User from '../models/User';

// register user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
}

export const registerUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      const isEmailExist = await UserModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler('Email already exist', 400));
      }

      const user: IRegistrationBody = {
        name: `${firstName} ${lastName}`,
        email,
        password,
      };
      const activationToken = createActivationToken(user);

      // const activationCode = activationToken.activationCode;
      const activationUrl = `http://localhost:5173/${activationToken}`;

      const data = { user: { name: user.name }, activationUrl };
      const html = await ejs.renderFile(
        path.join(__dirname, '../mails/activation-mail.ejs'),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: 'Activate your account',
          template: 'activation-mail.ejs',
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account!`,
          activationToken: activationToken,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Function to create an activation token
export const createActivationToken = (user: IRegistrationBody): string => {
  const token = jwt.sign({ user }, process.env.ACTIVATION_SECRET as Secret, {
    expiresIn: '5m',
  });
  return token;
};

// activate user
interface IActivationRequest {
  activation_token: string;
}

export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token } = req.body as IActivationRequest;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser };

      if (!newUser) {
        return next(new ErrorHandler('Invalid token', 400));
      }
      const { name, email, password } = newUser.user;

      let user = await UserModel.findOne({ email });

      if (user) {
        return next(new ErrorHandler('User already exists', 400));
      }
      user = await User.create({
        name,
        email,
        password,
      });
      res.status(201).json({ success: true });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
      }
      const user = await UserModel.findOne({ email }).select('+password');

      if (!user) {
        return next(new ErrorHandler('Invalid credentials', 400));
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler('Invalid credentials', 400));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
