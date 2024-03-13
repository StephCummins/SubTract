import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './MaterialUITheme';
import { ThemeProvider } from '@mui/material/styles';
import ServerErrors from '../../server/models/ServerErrors';

const DeleteAccountPage = ({
  user,
  subs,
  setSubs,
  setShowMenu,
  userNotAuthenticated
}): JSX.Element => {
  const navigate = useNavigate();

  useEffect(() => {
    setShowMenu(true);
  }, []);

  const handleOnClick = () => {
    deleteUserAccount();
  };

  const deleteUserAccount = async () => {
    try {
      if (subs.length > 0) {
        const deleteSubs = await deleteAllSubs();
        setSubs([]);

        if (!deleteSubs)
          throw new Error('Error deleting all user subscriptions');
      }

      const response = await fetch('/user/deleteaccount', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      if (!response.ok) throw response;

      await userNotAuthenticated();
      navigate('/');
    } catch (error) {
      console.log(error, 'Error deleting user account');
    }
  };

  const deleteAllSubs = async () => {
    try {
      const response = await fetch('/subs/deleteallsubs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      if (!response.ok) return false;

      const data = await response.json();

      if (data.message === ServerErrors.USER_NOT_AUTHENTICATED) {
        await userNotAuthenticated();
        navigate('/');
      } else return true;
    } catch (error) {
      console.log(error, 'Error deleting all user subs');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            mt: 15,
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
