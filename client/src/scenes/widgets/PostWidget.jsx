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
import { useSelector } from 'react-redux';
import {
  useUpdateLikesMutation,
  useGetPostsQuery,
} from '../../redux/features/post/postApi';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import { MoreVert, ThumbUpAlt, ThumbUpAltOutlined, Share } from '@mui/icons-material';

const PostWidget = ({ post, user }) => {
  const { palette } = useTheme();
  // const { user } = useSelector((state) => state.auth);
  const [likes, setLikes] = useState(post?.likes || []);
  const [updateLikes] = useUpdateLikesMutation();
  const navigate = useNavigate();
  const main = palette.neutral.main;

  const hasLikedPost = likes.some((like) => like.userId === user._id);

  const handleLike = async () => {
    try {
      // Optimistic UI update
      await updateLikes({ postId: post._id });
      const updatedLikes = hasLikedPost
        ? likes.filter((like) => like.userId !== user._id)
        : [...likes, { userId: user._id, userName: user.userName }];

      setLikes(updatedLikes);
    } catch (error) {
      // Rollback the optimistic UI update on error
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

  return (
    <Card
      sx={{
        padding: '1.5rem 1.5rem 0.75rem 1.5rem',
        backgroundColor: palette.background.alt,
        borderRadius: '0.75rem',
        m: '2rem 0',
      }}
    >
      <Box onClick={() => navigate(`/profile/${post?.user._id}`)} sx={{ cursor: 'pointer' }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: 'grey' }}
              aria-label="avatar"
              src={post?.user?.profilePicture?.url || ''}
            >
              {!post?.user?.profilePicture?.url && post?.user?.name?.charAt(0)}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
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
        <IconButton aria-label="add to favorites">
          <Button
            size="small"
            color="primary"
            disabled={!user}
            onClick={handleLike}
          >
            <Likes />
          </Button>
        </IconButton>
        <IconButton aria-label="share">
          <Share />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PostWidget;
