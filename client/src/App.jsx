import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';
import LoginPage from './scenes/loginPage';
import HomePage from './scenes/homePage';

const App = () => {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
        <Toaster position="top-center" reverseOrder={false} />
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Navigate to="home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route
              path="/auth"
              element={
                !user ? <LoginPage /> : <Navigate to="/home" replace={true} />
              }
            />
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
