import { Request, Response, NextFunction } from 'express';
import cloudinary from 'cloudinary';
import Post from '../models/Post';
import { catchAsyncError } from '../middleware/catchAsyncError';
import ErrorHandler from '../utils/errorHandler';
import Notification from '../models/Notification';
import UserModel from '../models/User';

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
        user: req.user,
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

      res.status(200).json({ success: true, posts });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// get all posts
export const getUserPosts = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return next(new ErrorHandler('User ID is required', 400));
      }

      const posts = await Post.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('user', 'name email profilePicture');

      if (posts.length === 0) {
        const userExists = await UserModel.exists({ _id: userId });
        if (!userExists) {
          return next(new ErrorHandler('User not found', 404));
        }
      }

      res.status(200).json({ success: true, posts });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const singlePost = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params;

      const post = await Post.findById(postId)
        .populate('user', 'name email profilePicture')
        .populate('replies.user', 'name email profilePicture')
        .populate('replies.reply.user', 'name email profilePicture');

      if (!post) {
        return next(new ErrorHandler('Post not found', 404));
      }

      res.status(200).json({
        success: true,
        post,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// export const getAllUserPosts = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userId = req.user?._id;
//       const posts = await Post.find({ 'user._id': userId }).sort({
//         createdAt: -1,
//       });

//       res.status(200).json({ success: true, posts });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );
// export const getAllUserPosts = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { id } = req.params;
//       const posts = await Post.find({id}).sort({
//         createdAt: -1,
//       });

//       res.status(200).json({ success: true, posts });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

// add or remove likes
export const updateLikes = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.body;
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

        if (post.user && userId !== post.user?._id.toString()) {
          await Notification.deleteOne({
            'creator._id': userId,
            userId: post.user?._id.toString(),
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

        if (post.user && userId !== post.user?._id.toString()) {
          await Notification.create({
            creator: req.user,
            type: 'Like',
            title: post.title ? post.title : 'Liked your post',
            userId: post.user?._id.toString(),
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

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }

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
        reply.likes = reply.likes.filter((like) => like.userId !== req.user.id);

        if (req.user.id !== post.user?.id.toString()) {
          await Notification.deleteOne({
            'creator._id': req.user.id,
            userId: post.user?.id.toString(),
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

      const newLike = {
        name: req.user.name,
        userName: req.user.userName,
        userId: req.user.id,
        userAvatar: req.user.profilePicture.url,
      };

      reply.likes.push(newLike);

      if (req.user.id !== post.user?._id.toString()) {
        await Notification.create({
          creator: req.user,
          type: 'Like',
          title: replyTitle ? replyTitle : 'Liked your Reply',
          userId: post.user?._id.toString(),
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

// add or remove likes on replies reply
export const updateRepliesReplyLike = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.body.postId;
      const replyId = req.body.replyId;
      const singleReplyId = req.body.singleReplyId;
      const replyTitle = req.body.replyTitle;
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }

      const replyObject = post.replies.find(
        (reply) => reply._id.toString() === replyId
      );

      if (!replyObject) {
        return res.status(404).json({
          success: false,
          message: 'Reply not found',
        });
      }

      const reply = replyObject.reply?.find(
        (reply) => reply._id.toString() === singleReplyId
      );

      if (!reply) {
        return res.status(404).json({
          success: false,
          message: 'Reply not found',
        });
      }

      const isLikedBefore = reply.likes.some(
        (like) => like.userId === req.user.id
      );

      if (isLikedBefore) {
        reply.likes = reply.likes.filter((like) => like.userId !== req.user.id);

        if (req.user.id !== post.user?._id.toString()) {
          await Notification.deleteOne({
            'creator._id': req.user.id,
            userId: post.user?._id.toString(),
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
        userAvatar: req.user.profilePicture.url,
      };

      reply.likes.push(newLike);

      if (req.user.id !== post.user?._id.toString()) {
        await Notification.create({
          creator: req.user,
          type: 'Like',
          title: replyTitle ? replyTitle : 'Liked your Reply',
          userId: post.user?._id.toString(),
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

// delete post
export const deletePost = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return next(new ErrorHandler('Post is not found with this id', 404));
      }

      if (post.image?.public_id) {
        await cloudinary.v2.uploader.destroy(post.image.public_id);
      }

      await Post.deleteOne({ _id: req.params.id });

      res.status(201).json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error, 400));
    }
  }
);
