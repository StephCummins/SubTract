import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import theme from './MaterialUITheme';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ServerErrors from '../../server/models/ServerErrors';
import UserErrors from '../models/UserErrors';

const AccountPage = ({
  user,
  setUser,
  userError,
  setUserError,
  userNotAuthenticated,
  setShowMenu
}): JSX.Element => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setShowMenu(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setUserError(UserErrors.NONE);

    if (!firstName || !lastName || !email) {
      setUserError(UserErrors.INCOMPLETE_CREDENTIALS);
      return;
    }

    const updatedUser = {
      userId: user.userId,
      firstName,
      lastName,
      email,
      password: user.password,
      googleAuth: user.googleAuth,
      picture: user.picture,
      dateCreated: user.dateCreated,
      newPassword: password
    };

    try {
      const response = await fetch('/user/updateaccount', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });

      if (!response.ok) throw response;

      const data = await response.json();

      if (data.message === ServerErrors.USER_NOT_AUTHENTICATED) {
        await userNotAuthenticated();
        navigate('/');
      } else {
        await setUser(data);
        navigate('/dashboard');
      }
    } catch (error) {
      console.log('Error updating account!', error);
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
            Update Account
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="New Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
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
                type="submit"
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
                Update Account
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
            <Grid container flexDirection="column" alignItems="flex-end">
              <Grid item>
                <Link
                  onClick={() => navigate('/delete')}
                  variant="body2"
                  sx={{ cursor: 'pointer' }}
                >
                  Delete Account
                </Link>
              </Grid>
              {userError === UserErrors.INCOMPLETE_CREDENTIALS && (
                <Grid item sx={{ alignItems: 'left' }}>
                  <Typography sx={{ color: 'red' }}>
                    <strong>Please Fill Out All Required Fields</strong>
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AccountPage;
