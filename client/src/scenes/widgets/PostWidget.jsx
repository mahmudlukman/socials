import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetPostsQuery,
  useGetUserPostsQuery,
} from '../../redux/features/post/postApi';
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const { user } = useSelector((state) => state.auth);
  const { data: posts, isLoading, isError } = useGetPostsQuery();
  const { data: userPosts } = useGetUserPostsQuery();

  console.log(posts)

  useEffect(() => {
    posts()
    // if (isProfile) {
    //   posts();
    // } else {
    //   userPosts();
    // }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts?.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
