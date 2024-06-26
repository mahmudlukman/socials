import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetPostsQuery, useGetUserPostsQuery } from '../../redux/features/post/postApi';
import PostWidget from './PostWidget';
import { CircularProgress } from '@mui/material';

const PostsWidget = ({ isProfile = false }) => {
  const { user } = useSelector((state) => state.auth);
  const { data: postsData, isLoading: isPostsLoading, isError: isPostsError } = useGetPostsQuery();
  const { data: userPostsData, isLoading: isUserPostsLoading, isError: isUserPostsError } = useGetUserPostsQuery(user?._id);

  useEffect(() => {
    console.log("Posts Data:", postsData);
    console.log("User Posts Data:", userPostsData);
  }, [postsData, userPostsData]);

  const posts = isProfile ? userPostsData : postsData;
  const isLoading = isProfile ? isUserPostsLoading : isPostsLoading;
  const isError = isProfile ? isUserPostsError : isPostsError;

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <div>Error loading posts</div>;
  }

  // Check if posts is an array
  if (!Array.isArray(posts?.posts)) {
    return <div>Unexpected data format</div>;
  }

  return (
    <>
      {posts?.posts?.map(
        ({
          _id,
          title,
          image,
          user,
          likes,
          replies,
          createdAt,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            title={title}
            image={image?.url}
            userName={user.userName}
            userAvatar={user.userAvatar}
            likes={likes}
            replies={replies}
            createdAt={createdAt}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
