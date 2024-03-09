import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './MaterialUITheme';
import MenuBar from './MenuBar';

const DeleteAccountPage = ({ user, setUser, setIsLoggedIn }): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <MenuBar user={user} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
      <CssBaseline />
    </ThemeProvider>
  );
};

export default DeleteAccountPage;
