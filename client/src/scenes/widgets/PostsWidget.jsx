import { useEffect } from 'react';
import {
  useGetPostsQuery,
  useGetUserPostsQuery,
} from '../../redux/features/post/postApi';
import PostWidget from './PostWidget';
import { CircularProgress, Box, Typography } from '@mui/material';

const PostsWidget = ({ user, isProfile = false }) => {
  const { data: postData, isLoading: isPostsLoading } = useGetPostsQuery();
  const { data: userPostData, isLoading: isUserPostsLoading } = useGetUserPostsQuery(user);

  if (isProfile ? isUserPostsLoading : isPostsLoading) {
    return <CircularProgress />;
  }

  const posts = isProfile ? userPostData?.posts : postData?.posts;

  if (!posts || posts.length === 0) {
    return <Typography>No Posts</Typography>;
  }

  return (
    <>
      {posts.map((post) => (
        <Box key={post._id}>
          <PostWidget post={post} user={user} />
        </Box>
      ))}
    </>
  );
};

export default PostsWidget;
