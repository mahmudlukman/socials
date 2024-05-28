import mongoose, { Document, Schema, model, Model } from 'mongoose';

// Interfaces for nested objects
interface ILike {
  name: string;
  userName: string;
  userId: string;
  userAvatar: string;
}

interface IReply {
  user: any; // Define a proper type or interface for the user
  title: string;
  image: {
    public_id: string;
    url: string;
  };
  createdAt: Date;
  likes: ILike[];
  reply?: IReply[]; // Optional, as replies can be nested
}

// Main Post interface
interface IPost extends Document {
  title: string;
  image: {
    public_id: string;
    url: string;
  };
  user: any; // Define a proper type or interface for the user
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

const replySchema: Schema<IReply> = new mongoose.Schema({
  user: { type: Object }, // Adjust this to the proper type for the user
  title: { type: String },
  image: {
    public_id: { type: String },
    url: { type: String },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [likeSchema],
  reply: [
    {
      user: { type: Object }, // Adjust this to the proper type for the user
      title: { type: String },
      image: {
        public_id: { type: String },
        url: { type: String },
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      likes: [likeSchema],
    },
  ],
});

const postSchema: Schema<IPost>  = new mongoose.Schema({
  title: { type: String },
  image: {
    public_id: { type: String },
    url: { type: String },
  },
  user: { type: Object }, // Adjust this to the proper type for the user
  likes: [likeSchema],
  replies: [replySchema],
}, { timestamps: true });

const Post: Model<IPost> = mongoose.model('Post', postSchema);

export default Post;
