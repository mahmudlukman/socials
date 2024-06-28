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
  useForgotPasswordMutation,
} from '../../redux/features/auth/authApi';
import { toast } from 'react-hot-toast';

import Input from './Input';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  emailOrUsername: '',
  password: '',
  confirmPassword: '',
};

const Form = () => {
  const theme = useTheme();
  const { palette } = theme;
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
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
      data: registerData,
    },
  ] = useRegisterMutation();
  const [
    forgotPassword,
    {
      isLoading: forgotPasswordLoading,
      isSuccess: forgotPasswordSuccess,
      error: forgotPasswordError,
    },
  ] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const switchMode = (mode) => {
    setForm(initialState);
    setShowPassword(false);
    if (mode === 'signup') {
      setIsSignup(true);
      setIsForgotPassword(false);
    } else if (mode === 'signin') {
      setIsSignup(false);
      setIsForgotPassword(false);
    } else if (mode === 'forgotPassword') {
      setIsForgotPassword(true);
      setIsSignup(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isForgotPassword) {
      await forgotPassword({ email: form.email });
      return;
    }

    if (isSignup && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (isSignup) {
      const { email, password, firstName, lastName } = form;
      await register({ email, password, firstName, lastName });
    } else {
      await login({
        emailOrUsername: form.emailOrUsername,
        password: form.password,
      });
    }
  };

  useEffect(() => {
    if (loginSuccess) {
      toast.success('Welcome');
      navigate('/');
    }

    if (registerSuccess) {
      const successMessage = registerData?.message || 'Registration Successful! You can log in to your account.';
      toast.success(successMessage);
      navigate('/');
    }

    if (forgotPasswordSuccess) {
      toast.success('Password reset link sent to your email.');
      switchMode('signin');
    }

    if (loginError || registerError || forgotPasswordError) {
      const errorMessage =
        loginError?.data?.message ||
        registerError?.data?.message ||
        forgotPasswordError?.data?.message ||
        'Something went wrong!';
      toast.error(errorMessage);
    }
  }, [
    loginSuccess,
    loginError,
    registerSuccess,
    registerError,
    forgotPasswordSuccess,
    forgotPasswordError,
  ]);

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
          {isSignup
            ? 'Sign up'
            : isForgotPassword
            ? 'Forgot Password'
            : 'Sign in'}
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
                <Input
                  name="email"
                  label="Email"
                  handleChange={handleChange}
                  type="email"
                />
                <Input
                  name="password"
                  label="Password"
                  handleChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  handleShowPassword={() => setShowPassword(!showPassword)}
                />
                <Input
                    name="confirmPassword"
                    label="Repeat Password"
                    handleChange={handleChange}
                    type="password"
                  />
              </>
            )}
            {!isForgotPassword && !isSignup && (
              <>
                <Input
                  name="emailOrUsername"
                  label="Email Or Username"
                  handleChange={handleChange}
                  type="text"
                />
                <Input
                  name="password"
                  label="Password"
                  handleChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  handleShowPassword={() => setShowPassword(!showPassword)}
                />
              </>
            )}
            {isForgotPassword && (
              <Input
                name="email"
                label="Email"
                handleChange={handleChange}
                type="email"
                autoFocus
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
            {loginLoading || registerLoading || forgotPasswordLoading ? (
              <CircularProgress
                size={24}
                sx={{ color: palette.background.alt }}
              />
            ) : isSignup ? (
              'Register'
            ) : isForgotPassword ? (
              'Send Reset Link'
            ) : (
              'Login'
            )}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Button
                onClick={() => switchMode(isSignup ? 'signin' : 'signup')}
              >
                {isSignup
                  ? 'Already have an account? Login'
                  : "Don't have an account? Register"}
              </Button>
            </Grid>
            {!isSignup && !isForgotPassword && (
              <Grid item>
                <Button onClick={() => switchMode('forgotPassword')}>
                  Forgot Password
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Form;
