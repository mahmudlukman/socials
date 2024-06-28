import {
  ChatBubbleOutlineOutlined,
  ExpandMore,
  Favorite,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  MoreVert,
  Share,
  ShareOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
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
import FlexBetween from '../../components/FlexBetween';
import Friend from '../../components/Friend';
import WidgetWrapper from '../../components/WidgetWrapper';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserImage from '../../components/UserImage';
import moment from 'moment';

const PostWidget = ({ post }) => {
  const { palette } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const main = palette.neutral.main;
  const primary = palette.primary.main;

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
          <Favorite />
        </IconButton>
        <IconButton aria-label="share">
          <Share />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PostWidget;
