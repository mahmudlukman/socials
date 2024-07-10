import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  useUpdateLikesMutation,
  useAddReplyMutation,
  useGetPostsQuery,
} from '../../redux/features/post/postApi';
import {
  useFollowUnfollowMutation,
  useGetUserQuery,
} from '../../redux/features/user/userApi';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import { MoreVert, ThumbUpAlt, ThumbUpAltOutlined, Share, Send } from '@mui/icons-material';

const SinglePost = ({ currentUser }) => {
  const { postId } = useParams();
  const { palette } = useTheme();
  const navigate = useNavigate();

  const { data: postsData, isLoading: isPostsLoading } = useGetPostsQuery();
  const [updateLikes] = useUpdateLikesMutation();
  const [addReply] = useAddReplyMutation();
  const [followUnfollow] = useFollowUnfollowMutation();
  
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState([]);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: userData, isLoading: isUserLoading } = useGetUserQuery({ userId: post?.user?._id }, { skip: !post?.user?._id });

  useEffect(() => {
    if (postsData) {
      const foundPost = postsData.posts.find(p => p._id === postId);
      if (foundPost) {
        setPost(foundPost);
        setLikes(foundPost.likes || []);
        setReplies(foundPost.replies || []);
      }
    }
  }, [postsData, postId]);

  useEffect(() => {
    if (userData && currentUser) {
      setIsFollowing(currentUser.following.some(follow => follow.userId === userData.user._id));
    }
  }, [userData, currentUser]);

  if (isPostsLoading || isUserLoading) {
    return <CircularProgress />;
  }

  if (!post) {
    return <Typography>Post not found</Typography>;
  }

  const handleLike = async () => {
    try {
      await updateLikes({ postId: post._id });
      const updatedLikes = likes.some((like) => like.userId === currentUser._id)
        ? likes.filter((like) => like.userId !== currentUser._id)
        : [...likes, { userId: currentUser._id, userName: currentUser.userName }];
      setLikes(updatedLikes);
    } catch (error) {
      console.error('Error updating likes: ', error);
    }
  };

  const handleReply = async () => {
    if (newReply.trim()) {
      try {
        await addReply({ postId: post._id, content: newReply });
        setReplies([...replies, { user: currentUser, content: newReply, createdAt: new Date() }]);
        setNewReply('');
      } catch (error) {
        console.error('Error adding reply: ', error);
      }
    }
  };

  const handleFollow = async () => {
    try {
      await followUnfollow(post.user._id);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following/unfollowing: ', error);
    }
  };

  const Likes = () => {
    if (likes.length > 0) {
      return likes.some((like) => like.userId === currentUser._id) ? (
        <>
          <ThumbUpAlt fontSize="small" />
          &nbsp;
          {likes.length > 2
            ? `You and ${likes.length - 1} others`
            : `${likes.length} like${likes.length > 1 ? 's' : ''}`}
        </>
      ) : (
        <>
          <ThumbUpAltOutlined fontSize="small" />
          &nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
        </>
      );
    }
    return (
      <>
        <ThumbUpAltOutlined fontSize="small" />
        &nbsp;
      </>
    );
  };

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: 'grey', cursor: 'pointer' }}
            aria-label="avatar"
            src={post.user.profilePicture?.url}
            onClick={() => navigate(`/profile/${post.user._id}`)}
          >
            {!post.user.profilePicture?.url && post.user.name.charAt(0)}
          </Avatar>
        }
        action={
          <>
            <IconButton aria-label="settings">
              <MoreVert />
            </IconButton>
            {currentUser._id !== post.user._id && (
              <Button onClick={handleFollow}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </>
        }
        title={`${post.user.name} @${post.user.userName}`}
        subheader={moment(post.createdAt).fromNow()}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.title}
        </Typography>
        {post.image && (
          <CardMedia
            component="img"
            height="194"
            image={post.image.url}
            alt="Post image"
          />
        )}
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleLike}>
          <Likes />
        </IconButton>
        <IconButton aria-label="share">
          <Share />
        </IconButton>
      </CardActions>

      <CardContent>
        <Typography variant="h6">Replies</Typography>
        {replies.map((reply, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle2">{reply.user.name}</Typography>
            <Typography variant="body2">{reply.content}</Typography>
            <Typography variant="caption">{moment(reply.createdAt).fromNow()}</Typography>
          </Box>
        ))}
        <Box sx={{ display: 'flex', mt: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a reply"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
          />
          <IconButton onClick={handleReply}>
            <Send />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SinglePost;