import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import {
  useUpdateLikesMutation,
  useGetPostsQuery,
} from '../../redux/features/post/postApi';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { MoreVert, ThumbUpAlt, ThumbUpAltOutlined, Share } from '@mui/icons-material';

const PostWidget = ({ post, user }) => {
  const { palette } = useTheme();
  const [likes, setLikes] = useState(post?.likes || []);
  const [updateLikes] = useUpdateLikesMutation();
  const navigate = useNavigate();

  const hasLikedPost = likes.some((like) => like.userId === user._id);

  const handleLike = async (e) => {
    e.stopPropagation(); // Prevent navigation when liking
    try {
      await updateLikes({ postId: post._id });
      const updatedLikes = hasLikedPost
        ? likes.filter((like) => like.userId !== user._id)
        : [...likes, { userId: user._id, userName: user.userName }];

      setLikes(updatedLikes);
    } catch (error) {
      setLikes(
        hasLikedPost
          ? [...likes, { userId: user._id, userName: user.userName }]
          : likes.filter((like) => like.userId !== user._id)
      );
      console.error('Error updating likes: ', error);
    }
  };

  const Likes = () => {
    if (likes.length > 0) {
      return likes.some((like) => like.userId === user._id) ? (
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

  const handlePostClick = () => {
    navigate(`/post/${post._id}`);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation(); // Prevent navigation to post when clicking on profile
    navigate(`/profile/${post?._id}`);
  };

  return (
    <Card
      sx={{
        padding: '1.5rem 1.5rem 0.75rem 1.5rem',
        backgroundColor: palette.background.alt,
        borderRadius: '0.75rem',
        m: '2rem 0',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        },
      }}
      onClick={handlePostClick}
    >
      <Box onClick={handleProfileClick} sx={{ cursor: 'pointer' }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: 'grey' }}
              aria-label="avatar"
              src={post?.user?._id === user?._id 
                ? user?.profilePicture?.url 
                : post?.user?.profilePicture?.url}
            >
              {!post?.user?.profilePicture?.url && post?.user?.name?.charAt(0)}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={(e) => e.stopPropagation()}>
              <MoreVert />
            </IconButton>
          }
          title={`${post?.user?.name} @${post?.user?.userName}`}
          subheader={moment(post.createdAt).fromNow()}
        />
      </Box>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.title}
        </Typography>
        {post.image && (
          <CardMedia
            sx={{ borderRadius: '10px', mt: '5px' }}
            component="img"
            height="194"
            image={post.image.url}
            alt="img"
          />
        )}
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={handleLike}>
          <Button
            size="small"
            color="primary"
            disabled={!user}
          >
            <Likes />
          </Button>
        </IconButton>
        <IconButton aria-label="share" onClick={(e) => e.stopPropagation()}>
          <Share />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PostWidget;