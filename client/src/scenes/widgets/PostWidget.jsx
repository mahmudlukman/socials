import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from '@mui/icons-material';
import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material';
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
    <WidgetWrapper m="2rem 0">
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ mr: '10px' }}>
          <UserImage
            image={
              'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png' ||
              user.profilePicture.url
            }
          />
        </Box>
        <Typography color={main} sx={{ mt: '1rem', mr: '10px' }}>
          @{user.userName}
        </Typography>
        <Typography color={main} sx={{ mt: '1rem' }}>
          - {moment(post.createdAt).fromNow()}
        </Typography>
      </Box>
      <Typography color={main} sx={{ mt: '1rem' }}>
        {post.title}
      </Typography>
      {post.image && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: '0.75rem', marginTop: '0.75rem' }}
          src={post.image.url}
        />
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
