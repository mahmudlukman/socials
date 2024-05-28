import mongoose, { Document, Schema, model, Model } from 'mongoose';
import { IUser } from './User';

// Interfaces for nested objects
interface ILike {
  name: string;
  userName: string;
  userId: string;
  userAvatar: string;
}

interface IImage {
  public_id: string;
  url: string;
}

interface IReply {
  user: IUser;
  title: string;
  image?: IImage;
  createdAt: Date;
  likes: ILike[];
  reply?: IReply[];
}

// Main Post interface
interface IPost extends Document {
  title: string;
  image?: IImage;
  user: IUser;
  likes: ILike[];
  replies: IReply[];
}

// Schema definitions
const likeSchema: Schema<ILike> = new mongoose.Schema({
  name: { type: String },
  userName: { type: String },
  userId: { type: String },
  userAvatar: { type: String },
});

const imageSchema: Schema<IImage> = new mongoose.Schema({
  public_id: {
    type: String,
  },
  url: {
    type: String,
  },
});

const replySchema: Schema<IReply> = new mongoose.Schema({
  user: { type: Object },
  title: { type: String },
  image: imageSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [likeSchema],
  reply: [
    {
      user: { type: Object },
      title: { type: String },
      image: imageSchema,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      likes: [likeSchema],
    },
  ],
});

const postSchema: Schema<IPost> = new mongoose.Schema(
  {
    title: { type: String },
    image: imageSchema,
    user: { type: Object },
    likes: [likeSchema],
    replies: [replySchema],
  },
  { timestamps: true }
);

const Post: Model<IPost> = mongoose.model('Post', postSchema);

export default Post;
