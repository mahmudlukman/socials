import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

const UserImage = ({ image, size = '60px' }) => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: 'cover', borderRadius: '50%' }}
        width={size}
        height={size}
        alt={user.userName}
        src={
          image ||
          'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'
        }
      />
    </Box>
  );
};

export default UserImage;
