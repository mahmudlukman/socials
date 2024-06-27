import { Box, Typography, useTheme } from '@mui/material';
import Friend from '../../components/Friend';
import WidgetWrapper from '../../components/WidgetWrapper';

const FriendListWidget = ({ user }) => {
  const { palette } = useTheme();

  // useEffect(() => {
  //   getFriends();
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: '1.5rem' }}
      >
        Followers
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {user.followers.map((follower) => (
          <Friend
            key={follower.userId._id}
            friendId={follower.userId._id}
            name={follower.userId.name}
            bio={follower.userId.occupation}
            userProfilePicture={
              follower.userId.userProfilePicture ||
              'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'
            }
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
