require('dotenv').config();
import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  userName?: string;
  bio?: string;
  email: string;
  password: string;
  profilePicture: {
    public_id: string;
    url: string;
  };
  coverPicture: {
    public_id: string;
    url: string;
  };
  role: string;
  occupation: string;
  location: string;
  active: boolean;
  followers: { userId: string }[];
  following: { userId: string }[];
  viewedProfile?: number;
  impressions?: number;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
    },
    userName: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
    },
    bio: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    profilePicture: {
      public_id: String,
      url: String,
    },
    coverPicture: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    active: {
      type: Boolean,
      default: true,
    },
    occupation: {
      type: String,
    },
    location: {
      type: String,
    },
    followers: [
      {
        userId: {
          type: String,
          ref: 'User'
        },
      },
    ],
    following: [
      {
        userId: {
          type: String,
          ref: 'User'
        },
      },
    ],
    viewedProfile: {
      type: Number,
    },
    impressions: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Hash Password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// sign access token
UserSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || '', {
    expiresIn: "7d",
  });
};

// compare password
UserSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel: Model<IUser> = mongoose.model('User', UserSchema);
export default UserModel;
