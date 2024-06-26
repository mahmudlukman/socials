import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
  CloudUpload,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
  Avatar,
  TextField,
  ButtonBase,
  CircularProgress,
} from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import { styled } from '@mui/material/styles';
import WidgetWrapper from '../../components/WidgetWrapper';
import {
  useCreatePostMutation,
  useGetPostsQuery,
} from '../../redux/features/post/postApi';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useRef } from 'react';

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [createPost, { isLoading, isSuccess, error }] = useCreatePostMutation();
  const { refetch } = useGetPostsQuery();
  const [postData, setPostData] = useState({
    title: '',
    image: null,
  });
  const [image, setImage] = useState(null);
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (reader.readyState === 2) {
          setPostData({ ...postData, image: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const clear = () => {
    setPostData({ title: '', image: null });
  };

  const handlePost = async (e) => {
    e.preventDefault();
    await createPost({ ...postData });
    clear();
    refetch();
  };

  return (
    <WidgetWrapper>
      <form autoComplete="off" onSubmit={handlePost}>
        <FlexBetween gap="1.5rem">
          <Avatar
            sx={{ bgcolor: 'grey' }}
            aria-label="avatar"
            src={user?.profilePicture?.url || ''}
          >
            {!user?.profilePicture?.url && user?.name?.charAt(0)}
          </Avatar>
          <TextField
            name="title"
            value={postData.title}
            variant="standard"
            disableUnderline={false}
            multiline
            rows={4}
            placeholder={`What's on your mind ${user.name}...`}
            onChange={(e) => setPostData({ ...postData, title: e.target.value })}
            InputProps={{
              disableUnderline: true,
            }}
            sx={{
              width: '100%',
              backgroundColor: palette.neutral.light,
              borderRadius: '2rem',
              border: 'none',
              padding: '1rem 2rem',
            }}
          />
        </FlexBetween>
        {postData.image && (
          <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
            position="relative"
          >
            <img
              src={postData.image}
              alt=""
              style={{ width: '100%', objectFit: 'cover' }}
            />
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => setPostData({ ...postData, image: null })}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: palette.background.alt,
                '&:hover': {
                  bgcolor: palette.background.alt,
                },
              }}
            >
              <DeleteOutlined sx={{ color: palette.primary.main }} />
            </IconButton>
          </Box>
        )}

        <Divider sx={{ margin: '1.25rem 0' }} />

        <FlexBetween>
          <FlexBetween gap="0.25rem" onClick={() => {}}>
            <ButtonBase
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              sx={{ bgcolor: 'transparent' }}
            >
              <ImageOutlined sx={{ color: mediumMain }} />
              <Typography
                color={mediumMain}
                sx={{ '&:hover': { cursor: 'pointer', color: medium } }}
              >
                Image
              </Typography>
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </ButtonBase>
          </FlexBetween>

          {isNonMobileScreens ? (
            <>
              <FlexBetween gap="0.25rem">
                <GifBoxOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Clip</Typography>
              </FlexBetween>

              <FlexBetween gap="0.25rem">
                <AttachFileOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Attachment</Typography>
              </FlexBetween>

              <FlexBetween gap="0.25rem">
                <MicOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Audio</Typography>
              </FlexBetween>
            </>
          ) : (
            <FlexBetween gap="0.25rem">
              <MoreHorizOutlined sx={{ color: mediumMain }} />
            </FlexBetween>
          )}

          <Button
            disabled={!postData.title && !postData.image}
            type="submit"
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: '3rem',
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'POST'
            )}
          </Button>
        </FlexBetween>
      </form>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
