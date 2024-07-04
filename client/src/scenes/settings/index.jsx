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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Navbar from '../../scenes/navbar';
import { MoreVert } from '@mui/icons-material';
import UserWidget from '../widgets/UserWidget';
import MyProfileWidget from '../widgets/MyProfileWidget';
import { useSelector } from 'react-redux';

const SettingsPage = () => {
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  const { palette } = useTheme();
  const { user } = useSelector((state) => state.auth);
  return (
    <Box sx={{ color: 'white' }}>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? '26%' : undefined}>
          <UserWidget user={user} />
          <Box m="2rem 0" />
          {/* <FriendListWidget userId={userId} /> */}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? '42%' : undefined}
          mt={isNonMobileScreens ? undefined : '2rem'}
        >
          <MyProfileWidget />
          <Box m="2rem 0" />
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;
