import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from '@mui/icons-material';
import { Box, Typography, Divider, useTheme } from '@mui/material';
import UserImage from '../../components/UserImage';
import FlexBetween from '../../components/FlexBetween';
import WidgetWrapper from '../../components/WidgetWrapper';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LinkedIn from '../../assets/linkedin.png'
import Twitter from '../../assets/twitter.png'

const UserWidget = ({ userId, picturePath }) => {
  // const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  // useEffect(() => {
  //   getUser();
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // if (!user) {
  //   return null;
  // }

  // const {
  //   firstName,
  //   lastName,
  //   location,
  //   occupation,
  //   viewedProfile,
  //   impressions,
  //   friends,
  // } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={user.profilePicture.url} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                '&:hover': {
                  color: palette.primary.light,
                  cursor: 'pointer',
                },
              }}
            >
              {user.name}
            </Typography>
            <Typography color={medium}>
              {user.followers.length} followers
            </Typography>
            <Typography color={medium}>
              {user.following.length} following
            </Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <Typography color={medium}>{user.bio}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" />
          <Typography color={medium}>{user.location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" />
          <Typography color={medium}>{user.occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {user.viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {user.impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src={Twitter} alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={main}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src={LinkedIn} alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              <Typography color={main}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined color={main} />
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
