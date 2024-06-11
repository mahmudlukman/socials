import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResetPasswordMutation } from '../../redux/features/auth/authApi';
import { toast } from 'react-hot-toast';

import Input from './Input';

const initialState = {
  password: '',
  confirmPassword: '',
};

const ResetPassword = () => {
  const theme = useTheme();
  const { palette } = theme;
  const [form, setForm] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const query = new URLSearchParams(location.search);
  const token = query.get('token');
  const userId = query.get('id');

  useEffect(() => {
    if (!userId) {
      toast.error('Invalid reset password link.');
      navigate('/auth');
    }
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    try {
      await resetPassword({
        userId,
        token,
        newPassword: form.password,
      }).unwrap();
      toast.success(
        'Password reset successfully. Now you can log in with the new password!'
      );
      navigate('/auth');
    } catch (error) {
      toast.error(error.data?.message || 'Something went wrong!');
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        sx={{
          marginTop: theme.spacing(8),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: theme.spacing(2),
        }}
        elevation={6}
      >
        <Avatar
          sx={{
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
          }}
        >
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5" marginBottom="10px">
          Reset Password
        </Typography>
        <form
          sx={{
            width: '100%',
            marginTop: theme.spacing(3),
          }}
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2}>
            <Input
              name="password"
              label="New Password"
              handleChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              handleShowPassword={() => setShowPassword(!showPassword)}
            />
            <Input
              name="confirmPassword"
              label="Confirm Password"
              handleChange={handleChange}
              type="password"
            />
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              margin: theme.spacing(3, 0, 2),
              backgroundColor: palette.primary.main,
              color: palette.background.alt,
              '&:hover': { color: palette.primary.main },
            }}
          >
            {isLoading ? (
              <CircularProgress
                size={24}
                sx={{ color: palette.background.alt }}
              />
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ResetPassword;
