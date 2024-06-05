import { Request, Response, NextFunction } from 'express';
import cloudinary from 'cloudinary';
import Post from '../models/Post';
import { catchAsyncError } from '../middleware/catchAsyncError';
import ErrorHandler from '../utils/errorHandler';
import Notification from '../models/Notification';

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

// add or remove likes
export const updateLikes = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.body.postId;
      const userId = req.user.id;

      const post = await Post.findById(postId);

      if (!post) {
        return next(new ErrorHandler('Post not found', 404));
      }

      const isLikedBefore = post.likes.find((item) => item.userId === userId);

      if (isLikedBefore) {
        await Post.findByIdAndUpdate(postId, {
          $pull: {
            likes: {
              userId: userId,
            },
          },
        });

        if (post.user && userId !== post.user._id) {
          await Notification.deleteOne({
            'creator._id': userId,
            userId: post.user._id,
            type: 'Like',
          });
        }

        res.status(200).json({
          success: true,
          message: 'Like removed successfully',
        });
      } else {
        await Post.updateOne(
          { _id: postId },
          {
            $push: {
              likes: {
                name: req.user.name,
                userName: req.user.userName,
                userId: userId,
                userAvatar: req.user.profilePicture.url,
                postId,
              },
            },
          }
        );

        if (post.user && userId !== post.user._id) {
          await Notification.create({
            creator: req.user,
            type: 'Like',
            title: post.title ? post.title : 'Liked your post',
            userId: post.user._id,
            postId: postId,
          });
        }

        res.status(200).json({
          success: true,
          message: 'Like added successfully',
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// add replies in post
export const addReplies = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.body.postId;

      let myCloud;

      if (req.body.image) {
        myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
          folder: 'posts',
        });
      }

      const replyData = {
        user: req.user,
        title: req.body.title,
        image: req.body.image
          ? {
              public_id: myCloud?.public_id,
              url: myCloud?.secure_url,
            }
          : null,
        likes: [],
      } as any;

      // Find the post by its ID
      let post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }

      // Add the reply data to the 'replies' array of the post
      post.replies.push(replyData);

      // Save the updated post
      await post.save();

      res.status(201).json({
        success: true,
        post,
      });
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// add reply in reply
export const addReply = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const replyId = req.body.replyId;
      const postId = req.body.postId;

      let myCloud;

      if (req.body.image) {
        myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
          folder: 'posts',
        });
      }

      const replyData = {
        user: req.user,
        title: req.body.title,
        image: req.body.image
          ? {
              public_id: myCloud?.public_id,
              url: myCloud?.secure_url,
            }
          : null,
        likes: [],
      } as any;

      // Find the post by its ID
      let post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }

      // Find the reply by its ID
      let data = post.replies.find((reply) => reply._id.toString() === replyId);

      if (!data) {
        return next(new ErrorHandler('Reply not found', 401));
      }

      // Ensure data.reply is an array
      if (!Array.isArray(data.reply)) {
        data.reply = [];
      }

      data.reply.push(replyData);

      // Save the updated post
      await post.save();

      res.status(201).json({
        success: true,
        post,
      });
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


// add or remove likes on replies
export const updateReplyLikes = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.body.postId;
      const replyId = req.body.replyId;
      const replyTitle = req.body.replyTitle;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }

      // Find the reply in the 'replies' array based on the given replyId
      const reply = post.replies.find(
        (reply) => reply._id.toString() === replyId
      );

      if (!reply) {
        return res.status(404).json({
          success: false,
          message: 'Reply not found',
        });
      }

      const isLikedBefore = reply.likes.find(
        (item) => item.userId === req.user.id
      );

      if (isLikedBefore) {
        // If liked before, remove the like from the reply.likes array
        reply.likes = reply.likes.filter((like) => like.userId !== req.user.id);

        if (req.user.id !== post.user._id) {
          await Notification.deleteOne({
            'creator._id': req.user.id,
            userId: post.user._id,
            type: 'Reply',
            postId: postId,
          });
        }

        await post.save();

        return res.status(200).json({
          success: true,
          message: 'Like removed from reply successfully',
        });
      }

      // If not liked before, add the like to the reply.likes array
      const newLike = {
        name: req.user.name,
        userName: req.user.userName,
        userId: req.user.id,
        userAvatar: req.user.avatar.url,
      };

      reply.likes.push(newLike);

      if (req.user.id !== post.user._id) {
        await Notification.create({
          creator: req.user,
          type: 'Like',
          title: replyTitle ? replyTitle : 'Liked your Reply',
          userId: post.user._id,
          postId: postId,
        });
      }

      await post.save();

      return res.status(200).json({
        success: true,
        message: 'Like added to reply successfully',
      });
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
