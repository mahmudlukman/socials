import React from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { CssBaseline } from '@mui/material';
import AuthPage from './scenes/authPage';
import HomePage from './scenes/homePage';
import ResetPassword from './scenes/authPage/ResetPassword';
import ActivationPage from './scenes/authPage/Activation';
import ProfilePage from './scenes/profilePage/index';
import { ThemeProvider } from './themeProvider';
import Navbar from './scenes/navbar';
import SettingsPage from './scenes/settings';

const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider>
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
            <Route
              path="/profile/:userId"
              element={!user ? <AuthPage /> : <ProfilePage replace={true} />}
            />
            <Route
              path="/settings/:userId"
              element={!user ? <AuthPage /> : <SettingsPage replace={true} />}
            />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/activate-user" element={<ActivationPage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
