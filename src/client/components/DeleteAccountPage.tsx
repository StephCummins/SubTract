import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './MaterialUITheme';
import MenuBar from './MenuBar';

const DeleteAccountPage = ({ user, setUser, setIsLoggedIn }): JSX.Element => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    deleteUserAccount();
  };

  const deleteUserAccount = async () => {
    try {
      const response = await fetch('/user/deleteaccount', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      if (!response.ok) throw response;
      resetUser();
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.log(error, 'Error deleting user account');
    }
  };

  const resetUser = () => {
    const emptyUserInfo = {
      userId: null,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      googleAuth: null,
      picture: null,
      dateCreated: null
    };
    setUser(emptyUserInfo);
  };

  return (
    <ThemeProvider theme={theme}>
      <MenuBar user={user} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography
            variant="h1"
            color="primary"
            sx={{ textAlign: 'center' }}
            gutterBottom
          >
            Are You Sure You Want To Delete Your Account?
          </Typography>
          <Grid
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'center',
              alignItems: 'center',
              mt: 5
            }}
          >
            <Button
              onClick={handleOnClick}
              variant="contained"
              sx={{
                mt: 1,
                mb: 5,
                py: 2,
                mx: 2,
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
              Yes, Delete My Account
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={() => navigate('/dashboard')}
              sx={{
                width: '225px',
                mt: 1,
                mx: 2,
                mb: 5,
                py: 2,
                bgcolor: 'primary.main',
                '&:active': {
                  transform: 'translateY(4px)'
                }
              }}
            >
              Cancel
            </Button>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default DeleteAccountPage;
