import { useEffect } from 'react';
import {
  useGetPostsQuery,
  useGetUserPostsQuery,
} from '../../redux/features/post/postApi';
import PostWidget from './PostWidget';
import { CircularProgress, Box, Typography } from '@mui/material';

const PostsWidget = ({ user, isProfile = false }) => {
  const { data: postData, isLoading: isPostsLoading, refetch: refetchPosts } = useGetPostsQuery();
  const { 
    data: userPostData, 
    isLoading: isUserPostsLoading, 
    refetch: refetchUserPosts 
  } = useGetUserPostsQuery(user?._id);

  useEffect(() => {
    if (isProfile) {
      refetchUserPosts();
    } else {
      refetchPosts();
    }
  }, [user?.profilePicture?.url, isProfile, refetchUserPosts, refetchPosts]);

  if (isProfile ? isUserPostsLoading : isPostsLoading) {
    return <CircularProgress />;
  }

  const posts = isProfile ? userPostData?.posts : postData?.posts;

  if (!posts || posts.length === 0) {
    return <Typography sx={{m: "10px"}}>No Posts</Typography>;
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