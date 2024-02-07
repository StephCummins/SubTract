import React from 'react';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import theme from './MaterialUITheme';

const OrangeButton = ({ handleOnClick, children }): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <Button
        type="submit"
        onClick={handleOnClick}
        variant="contained"
        sx={{
          mt: 1,
          mb: 5,
          width: '225px',
          bgcolor: 'secondary.main',
          '&:active': {
            transform: 'translateY(4px)',
            bgcolor: 'secondary.main'
          },
          '&:hover': {
            bgcolor: 'secondary.dark'
          }
        }}
      >
        {children}
      </Button>
    </ThemeProvider>
  );
};

export default OrangeButton;
