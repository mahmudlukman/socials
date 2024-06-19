import { Box } from "@mui/material";
import { useSelector } from "react-redux";

const UserImage = ({ image, size = "60px" }) => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt={user.userName}
        src={user.profilePicture}
      />
    </Box>
  );
};

export default UserImage;
