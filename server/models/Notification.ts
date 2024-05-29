import mongoose, { Document, Schema, Model } from 'mongoose';
import { IUser } from './User';

export interface INotification extends Document {
  creator: Record<string, any>;
  type: string;
  title: string;
  status: string;
  postId: string;
  userId: string;
}

// Define the Mongoose schema using the TypeScript interface
const NotificationSchema: Schema<INotification> = new mongoose.Schema(
  {
    creator: {
      type: Object,
    },
    type: {
      type: String,
    },
    title: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      default: 'unread',
    },
    postId: {
      type: String,
    },
    userId: {
      type: String,
    },
  },
  { timestamps: true }
);

// Define the Mongoose model using the TypeScript interface
const Notification: Model<INotification> = mongoose.model(
  'Notification',
  NotificationSchema
);

export default Notification;
