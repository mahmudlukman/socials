import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { useParams } from "react-router-dom";
import Navbar from "../../scenes/navbar";
import MyPostWidget from "../../scenes/widgets/MyPostWidget";
import UserWidget from "../../scenes/widgets/UserWidget";
import { useGetUserQuery } from "../../redux/features/user/userApi";
import { useGetPostQuery } from "../../redux/features/post/postApi";
import PostDetailsWidget from "../widgets/PostDetailsWidget";

const PostPage = () => {
  const { userId } = useParams();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { data: user, isLoading } = useGetUserQuery({userId});
  const { data: post } = useGetPostQuery();


  if (isLoading) {
    return <CircularProgress/>;
  }

  return (
    <Box sx={{ color: 'white' }}>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget user={user} />
          <Box m="2rem 0" />
          {/* <FriendListWidget userId={userId} /> */}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget user={user} />
          <Box m="2rem 0" />
          <PostDetailsWidget post={post} currentUser={user}/>
        </Box>
      </Box>
    </Box>
  );
};

export default PostPage;
