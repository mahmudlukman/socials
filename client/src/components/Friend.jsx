import { PersonAddOutlined, PersonRemoveOutlined } from '@mui/icons-material';
import { Avatar, Box, IconButton, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';

const Friend = ({ friendId, name, bio, userProfilePicture }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFollower = user.followers.find(
    (follower) => follower._id === friendId
  );

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        {/* <Avatar sx={{ bgcolor: 'grey' }} aria-label="avatar" src="image">
          {user.name.charAt(0)}
        </Avatar> */}

        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              '&:hover': {
                color: palette.primary.light,
                cursor: 'pointer',
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {bio}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton sx={{ backgroundColor: primaryLight, p: '0.6rem' }}>
        {isFollower ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
    </FlexBetween>
  );
};

export default Friend;
