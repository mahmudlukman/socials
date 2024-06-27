import { useGetPostsQuery } from '../../redux/features/post/postApi';
import PostWidget from './PostWidget';
import { CircularProgress, Box } from '@mui/material';

const PostsWidget = ({ user, isProfile = false }) => {
  const { data: postData, isLoading } = useGetPostsQuery();

  if (isLoading) {
    return <CircularProgress />;
  } else if (!postData || postData.posts.length === 0) {
    return <Typography>No Posts</Typography>;
  }
  return (
    <>
      {postData.posts.map((post) => (
        <Box key={post._id}>
          <PostWidget post={post} user={user} />
        </Box>
      ))}
    </>
  );
};

export default PostsWidget;
