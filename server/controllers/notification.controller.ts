import { catchAsyncError } from '../middleware/catchAsyncError';
import Notification from '../models/Notification';
import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/errorHandler';
import cron from 'node-cron';

export const getNotifications = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await Notification.find({
        userId: req.user._id,
      }).sort({ createdAt: -1 });

      res.status(201).json({ success: true, notifications });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all notifications -- only admin
export const updateNotification = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await Notification.findById(req.params.id);

      if (!notification) {
        return next(new ErrorHandler('Notification not found!', 404));
      } else {
        notification.status
          ? (notification.status = 'read')
          : notification?.status;
      }

      await notification.save();

      const notifications = await Notification.find({
        userId: req.user.id,
      }).sort({
        createdAt: -1,
      });

      res.status(201).json({ success: true, notifications });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


cron.schedule('0 0 0 * * *', async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 100);
  await Notification.deleteMany({
    status: 'read',
    createdAt: { $lt: thirtyDaysAgo },
  });
  console.log('Deleted read notification');
});
