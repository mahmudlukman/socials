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
import { useNavigate } from 'react-router-dom';
import {
  useLoginMutation,
  useRegisterMutation,
} from '../../redux/features/auth/authApi';
import { toast } from 'react-hot-toast';

import Input from './Input';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Form = () => {
  const theme = useTheme();
  const { palette } = useTheme();
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [
    login,
    { isLoading: loginLoading, isSuccess: loginSuccess, error: loginError },
  ] = useLoginMutation();
  const [
    register,
    {
      isLoading: registerLoading,
      isSuccess: registerSuccess,
      error: registerError,
    },
  ] = useRegisterMutation();
  const navigate = useNavigate();

  const switchMode = () => {
    setForm(initialState);
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (isSignup) {
      await register(form);
    } else {
      await login(form);
    }
  };

  useEffect(() => {
    if (loginSuccess) {
      toast.success('Welcome');
      navigate('/');
    }

    if (registerSuccess) {
      toast.success('Registration Successful! You can log in to your account.');
      navigate('/');
    }
    if (loginError || registerError) {
      const errorMessage =
        loginError?.data?.message ||
        registerError?.data?.message ||
        'Something went wrong!';
      toast.error(errorMessage);
    }
  }, [loginSuccess, loginError, registerSuccess, registerError]);

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
        <Typography component="h1" variant="h5">
          {isSignup ? 'Sign up' : 'Sign in'}
        </Typography>
        <form
          sx={{
            width: '100%',
            marginTop: theme.spacing(3),
          }}
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name="emailOrUsername"
              label="email Or Username"
              handleChange={handleChange}
              type="emailOrUsername"
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              handleShowPassword={() => setShowPassword(!showPassword)}
            />
            {isSignup && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                type="password"
              />
            )}
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
            {loginLoading || registerLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isSignup ? (
              'Sign Up'
            ) : (
              'Sign In'
            )}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Form;
