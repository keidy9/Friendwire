import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  MoreVert,
  Send,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  InputBase,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  getPosts,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [isPostOptions, setIsPostOptions] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(
      `https://friendwire.fly.dev/posts/${postId}/like`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const deletePost = async () => {
    await fetch(`https://friendwire.fly.dev/posts/${postId}/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setIsPostOptions(!isPostOptions);
    getPosts();
  };

  const patchComment = async () => {
    console.log("comment", comment);

    if (comment) {
      const response = await fetch(
        `https://friendwire.fly.dev/posts/${postId}/comment`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId, comment }),
        }
      );
      const updatedPost = await response.json();
      console.log("updatedPost", updatedPost);

      dispatch(setPost({ post: updatedPost }));
    }
  };

  const onCommentChangeHandler = (e) => {
    setComment(e.target.value);
  };

  return (
    <WidgetWrapper m="2rem 0" maxWidth="700px">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`https://friendwire.fly.dev/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <FlexBetween gap="1rem">
          {postUserId === loggedInUserId && (
            <FlexBetween>
              <IconButton
                onClick={(event) => {
                  setIsPostOptions(!isPostOptions);
                  setAnchorEl(event.currentTarget);
                }}
              >
                <MoreVert />
              </IconButton>
              {isPostOptions && (
                <Menu
                  anchorEl={anchorEl}
                  open={isPostOptions}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  onClose={() => {
                    setIsPostOptions(!isPostOptions);
                    setAnchorEl(null);
                    console.log(isPostOptions);
                  }}
                >
                  <MenuItem onClick={() => deletePost()}>Delete</MenuItem>
                </Menu>
              )}
            </FlexBetween>
          )}

          <IconButton>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography
                sx={{
                  color: main,
                  m: "0.5rem 0",
                  pl: "1rem",
                  wordWrap: "break-word",
                }}
              >
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
          <FlexBetween padding="0 15px">
            <InputBase
              placeholder="Write a comment..."
              fullWidth={true}
              multiline={true}
              onKeyDown={(e) => {
                if (e.key === "Enter") patchComment();
              }}
              onChange={onCommentChangeHandler}
            />
            <IconButton onClick={patchComment}>
              <Send />
            </IconButton>
          </FlexBetween>
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
