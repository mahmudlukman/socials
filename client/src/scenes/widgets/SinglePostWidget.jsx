import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Avatar,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useFollowUnfollowMutation } from '../../redux/features/user/userApi';
import { useAddRepliesMutation } from '../../redux/features/post/postApi';
import { toast } from 'react-hot-toast';

const SinglePostWidget = ({ post }) => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments);
  const [followUser] = useFollowUnfollowMutation();
  const [addComment] = useAddRepliesMutation();


  const handleFollow = async () => {
    try {
      await followUser(post.author.id).unwrap();
      toast.success('You are now following this user');
    } catch (error) {
      toast.error('Failed to follow the user');
    }
  };

  const handleAddComment = async () => {
    if (comment.trim()) {
      try {
        const newComment = await addComment({
          postId: post.id,
          comment,
        }).unwrap();
        setComments([...comments, newComment]);
        setComment('');
        toast.success('Comment added');
      } catch (error) {
        toast.error('Failed to add comment');
      }
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            alt={post.author.userName}
            src={post.author.profilePicture.url}
            sx={{ width: 50, height: 50, mr: 2 }}
          />
          <Box>
            <Typography variant="h6">{post.author.userName}</Typography>
            <Button variant="contained" color="primary" onClick={handleFollow}>
              Follow
            </Button>
          </Box>
        </Box>
        <Typography variant="body1" mb={2}>
          {post.content}
        </Typography>
        {post.image && (
          <CardMedia
            component="img"
            height="200"
            image={post.image}
            alt="Post Image"
            sx={{ mb: 2 }}
          />
        )}
        <Typography variant="h6">Comments</Typography>
        <List>
          {comments.map((comment) => (
            <ListItem key={comment.id} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt={comment.user.userName}
                  src={comment.user.profilePicture.url}
                />
              </ListItemAvatar>
              <ListItemText
                primary={comment.user.userName}
                secondary={comment.content}
              />
            </ListItem>
          ))}
        </List>
        <Box display="flex" mt={2}>
          <TextField
            fullWidth
            variant="outlined"
            label="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddComment}
            sx={{ ml: 2 }}
          >
            Comment
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SinglePostWidget;
