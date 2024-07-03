import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  useTheme,
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const ProfileCard = ({ onSave }) => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    name: user.name,
    userName: user.userName,
    location: user.location,
    occupation: user.occupation,
    bio: user.bio,
    profileImage: user.profileImage,
    coverImage: user.coverImage,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(formValues);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormValues({
      name: user.name,
      userName: user.userName,
      location: user.location,
      occupation: user.occupation,
      bio: user.bio,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
    });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormValues({ ...formValues, [name]: event.target.result });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 3 }}>
      <Box position="relative">
        <CardMedia
          component="img"
          height="200"
          image={user?.coverPicture?.url || 'https://via.placeholder.com/600x200'}
          alt="Cover Image"
        />
        {isEditing && (
          <Box position="absolute" top={10} right={10}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="cover-image-input"
              type="file"
              name="coverImage"
              onChange={handleImageChange}
            />
            <label htmlFor="cover-image-input">
              <IconButton color="primary" component="span">
                <Edit />
              </IconButton>
            </label>
          </Box>
        )}
      </Box>
      <Box display="flex" justifyContent="center" mt={-8} position="relative">
        <Avatar
          alt={formValues.userName}
          src={user?.profilePicture?.url || formValues.profileImage}
          sx={{ width: 120, height: 120, border: `4px solid ${theme.palette.background.paper}` }}
        />
        {isEditing && (
          <Box position="absolute" bottom={-10} right={-10}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-image-input"
              type="file"
              name="profileImage"
              onChange={handleImageChange}
            />
            <label htmlFor="avatar-image-input">
              <IconButton color="primary" component="span">
                <Edit />
              </IconButton>
            </label>
          </Box>
        )}
      </Box>
      <CardContent>
        {isEditing ? (
          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              name="userName"
              value={formValues.userName}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Location"
              name="location"
              value={formValues.location}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Occupation"
              name="occupation"
              value={formValues.occupation}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Bio"
              name="bio"
              value={formValues.bio}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ mr: 2 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Cancel />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="h5" component="div" align="center">
              {user.name}
            </Typography>
            <Typography variant="h5" component="div" color="text.secondary" align="center">
              @{user.userName}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {user.email}
            </Typography>
            <Typography variant="body1" color="text.primary" align="center" mt={2}>
              {user.bio}
            </Typography>
            <Box display="flex" justifyContent="center" mt={2}>
              <IconButton color="primary" onClick={handleEdit}>
                <Edit />
              </IconButton>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
