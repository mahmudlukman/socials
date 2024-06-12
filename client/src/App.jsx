import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';
// import { ThemeProviderWrapper } from './themeProvider.jsx';
import AuthPage from './scenes/authPage';
import HomePage from './scenes/homePage';
import ResetPassword from './scenes/authPage/ResetPassword';
import ActivationPage from './scenes/authPage/Activation';

const App = () => {
  // const mode = useSelector((state) => state.auth);
  const { user, mode } = useSelector((state) => state.auth);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Toaster position="top-center" reverseOrder={false} />
          <CssBaseline />
          <Routes>
            <Route
              path="/"
              element={
                !user ? <AuthPage /> : <Navigate to="/home" replace={true} />
              }
            />
            <Route
              path="/home"
              element={!user ? <AuthPage /> : <HomePage replace={true} />}
            />
            <Route
              path="/auth"
              element={
                !user ? <AuthPage /> : <Navigate to="/home" replace={true} />
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/activate-user" element={<ActivationPage />} />
            {/* <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            /> */}
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
