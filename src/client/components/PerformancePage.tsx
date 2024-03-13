import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './MaterialUITheme';
import { ThemeProvider } from '@mui/material/styles';
import MenuBar from './MenuBar';

const PerformancePage = (subs, user, setUser, setIsLoggedIn): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MenuBar user={user} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
    </ThemeProvider>
  );
};

export default PerformancePage;
