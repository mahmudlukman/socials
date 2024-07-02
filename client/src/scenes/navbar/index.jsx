import React, { useState } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutQuery } from '../../redux/features/auth/authApi';
import { useNavigate } from 'react-router-dom';
import FlexBetween from '../../components/FlexBetween';
import { useThemeContext } from '../../themeProvider';

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [logout, setLogout] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');
  const { toggleTheme } = useThemeContext();
  const theme = useTheme();

  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const iconColor = theme.palette.mode === 'dark' ? dark : theme.palette.text.primary;

  const { refetch } = useLogoutQuery(undefined, {
    skip: !logout,
    refetchOnMountOrArgChange: true,
  });

  const handleLogout = async () => {
    setLogout(true);
  };

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate('/home')}
          sx={{
            '&:hover': {
              color: primaryLight,
              cursor: 'pointer',
            },
          }}
        >
          Socials
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search sx={{ color: iconColor }} />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={toggleTheme}>
            {theme.palette.mode === 'dark' ? (
              <LightMode sx={{ fontSize: '25px', color: iconColor }} />
            ) : (
              <DarkMode sx={{ fontSize: '25px', color: iconColor }} />
            )}
          </IconButton>
          <Message sx={{ fontSize: '25px', cursor: 'pointer', color: iconColor }} />
          <Notifications sx={{ fontSize: '25px', cursor: 'pointer', color: iconColor }} />
          <Help sx={{ fontSize: '25px', cursor: 'pointer', color: iconColor }} />
          <FormControl variant="standard" value={`@${user.userName}`}>
            <Select
              value={`@${user.userName}`}
              sx={{
                backgroundColor: neutralLight,
                width: '150px',
                borderRadius: '0.25rem',
                p: '0.25rem 1rem',
                '& .MuiSvgIcon-root': {
                  pr: '0.25rem',
                  width: '3rem',
                },
                '& .MuiSelect-select:focus': {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={`@${user.userName}`}>
                <Typography>{`@${user.userName}`}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu sx={{ color: iconColor }} />
        </IconButton>
      )}

      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close sx={{ color: iconColor }} />
            </IconButton>
          </Box>

          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton sx={{ fontSize: '25px' }} onClick={toggleTheme}>
              {theme.palette.mode === 'dark' ? (
                <LightMode sx={{ fontSize: '25px', color: iconColor }} />
              ) : (
                <DarkMode sx={{ fontSize: '25px', color: iconColor }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: '25px', cursor: 'pointer', color: iconColor }} />
            <Notifications sx={{ fontSize: '25px', cursor: 'pointer', color: iconColor }} />
            <Help sx={{ fontSize: '25px', cursor: 'pointer', color: iconColor }} />
            <FormControl variant="standard" value={`@${user.userName}`}>
              <Select
                value={`@${user.userName}`}
                sx={{
                  backgroundColor: neutralLight,
                  width: '150px',
                  borderRadius: '0.25rem',
                  p: '0.25rem 1rem',
                  '& .MuiSvgIcon-root': {
                    pr: '0.25rem',
                    width: '3rem',
                  },
                  '& .MuiSelect-select:focus': {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={`@${user.userName}`}>
                  <Typography>{`@${user.userName}`}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
