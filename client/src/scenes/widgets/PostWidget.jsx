import {
  ChatBubbleOutlineOutlined,
  ExpandMore,
  Favorite,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  MoreVert,
  Share,
  ShareOutlined,
  ThumbUpAlt,
  ThumbUpAltOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useUpdateLikesMutation,
  useGetPostsQuery,
} from '../../redux/features/post/postApi';
import moment from 'moment';

const PostWidget = ({ post }) => {
  const { palette } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [likes, setLikes] = useState(post?.likes || []);
  const [updateLikes] = useUpdateLikesMutation();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const hasLikedPost = likes.some((like) => like.userId === user._id);

  const handleLike = async () => {
    try {
      const response = await updateLikes({ postId: post._id }).unwrap();
      setLikes(response.likes || []); // Ensure likes is always an array
    } catch (error) {
      console.error("Error updating likes: ", error);
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
        &nbsp;Like
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
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: 'grey' }}
            aria-label="avatar"
            src={user?.profilePicture?.url || ''}
          >
            {!user?.profilePicture?.url && user?.name?.charAt(0)}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVert />
          </IconButton>
        }
        title={`@${user.userName}`}
        subheader={moment(post.createdAt).fromNow()}
      />
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
