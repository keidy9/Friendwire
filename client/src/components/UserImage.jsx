import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={
          image === "blank-profile-picture.png"
            ? "../assets/blank-profile-picture.png"
            : `https://friendwire.fly.dev/assets/${image}`
        }
      />
    </Box>
  );
};

export default UserImage;
