import { Box, CircularProgress, useMediaQuery } from '@mui/material';
import { useParams } from 'react-router-dom';
import Navbar from '../../scenes/navbar';
// import FriendListWidget from "../../scenes/widgets/FriendListWidget";
import MyPostWidget from '../../scenes/widgets/MyPostWidget';
import PostsWidget from '../../scenes/widgets/PostsWidget';
import UserWidget from '../../scenes/widgets/UserWidget';
import { useGetUserQuery } from '../../redux/features/user/userApi';

const SettingsPage = () => {
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  return (
    <Box sx={{ color: 'white' }}>
      <Navbar />
      settings
    </Box>
  );
};

export default SettingsPage;
