import { Request, Response, NextFunction } from 'express';
import cloudinary from 'cloudinary';
import Post from '../models/Post';
import { catchAsyncError } from '../middleware/catchAsyncError';
import ErrorHandler from '../utils/errorHandler';

export const createPost = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { image, title, user, replies } = req.body;

      let myCloud;

      if (image) {
        myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: 'posts',
        });
      }

      const processedReplies =
        replies && Array.isArray(replies)
          ? await Promise.all(
              replies.map(async (item: { image: string }) => {
                if (item.image) {
                  const replyImage = await cloudinary.v2.uploader.upload(
                    item.image,
                    {
                      folder: 'posts',
                    }
                  );
                  item.image = {
                    public_id: replyImage.public_id,
                    url: replyImage.secure_url,
                  } as any;
                }
                return item;
              })
            )
          : [];

      const post = new Post({
        title,
        image: image
          ? {
              public_id: myCloud?.public_id,
              url: myCloud?.secure_url,
            }
          : null,
        user,
        replies: processedReplies,
      });

      await post.save();

      res.status(201).json({
        success: true,
        post,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all posts
export const getAllPosts = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await Post.find().sort({
        createdAt: -1,
      });

      res.status(201).json({ success: true, posts });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
