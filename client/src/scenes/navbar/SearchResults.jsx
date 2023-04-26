import { Box, Typography } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import { useNavigate } from "react-router-dom";

const SearchResults = ({ displayedUsers, alt, dark, mediumMain }) => {
  const navigate = useNavigate();

  return (
    <FlexBetween>
      {displayedUsers.length > 0 && (
        <Box
          display="flex"
          justifyContent="space-evenly"
          flexDirection="column"
          position="absolute"
          margin="auto"
          top="5vh"
          left="47.5vh"
          zIndex="1"
          padding="5px 15px"
          backgroundColor={alt}
          overflow="hidden"
          marginLeft="-49vh"
        >
          {displayedUsers.map((person) => (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="start"
              gap="1rem"
              margin="1vh 0"
              cursor="pointer"
              onClick={() => {
                navigate(`/profile/${person._id}`);
                navigate(0);
              }}
              sx={{
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: `${mediumMain} !important`,
                },
              }}
            >
              <UserImage image={person.picturePath} />
              <Box>
                <Typography
                  variant="h4"
                  color={dark}
                  fontWeight="500"
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  {person.firstName} {person.lastName}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </FlexBetween>
  );
};

export default SearchResults;
