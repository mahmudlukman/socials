import React, { useEffect } from 'react';
import {
  Avatar,
  Paper,
  Typography,
  Container,
  useTheme,
  Box,
} from '@mui/material';
import { BeenhereOutlined } from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useActivationMutation } from '../../redux/features/auth/authApi';
import { toast } from 'react-hot-toast';

const ActivationPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [activation, { isSuccess, error }] = useActivationMutation();

  const query = new URLSearchParams(location.search);
  const activation_token = query.get('token');

  useEffect(() => {
    if (!activation_token) {
      toast.error('Invalid activation token.');
      navigate('/auth');
    }

    if (activation_token) {
      activation({ activation_token });
    }
  }, [activation_token, activation]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Account activated successfully');
    }
    if (error) {
      if ('data' in error) {
        const errorData = error;
        toast.error(errorData.data.message);
      } else {
        console.log('An error occurred', error);
      }
    }
  }, [isSuccess, error]);

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
          <BeenhereOutlined />
        </Avatar>
        {error ? (
          <Typography component="h4" variant="h5" marginBottom="10px">
            Your token is expired!
          </Typography>
        ) : (
          <Box>
            <Typography component="h1" variant="h5" marginBottom="10px">
              Your account has been created successfully!
            </Typography>
            <Link to="/auth">
              <Typography component="h4" variant="h5" marginBottom="10px">
                Login to your account!
              </Typography>
            </Link>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ActivationPage;
