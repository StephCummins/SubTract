import React, { useState, useEffect } from 'react';
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
import UserErrors from '../models/UserErrors';

interface NewUserAccount {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  googleAuth: boolean;
}

const SignupPage = ({
  signUp,
  userError,
  setUserError,
  setShowMenu
}): JSX.Element => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setShowMenu(false);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setUserError(UserErrors.NONE);

    const accountInfo: NewUserAccount = {
      firstName,
      lastName,
      email,
      password,
      googleAuth: false
    };

    if (!firstName || !lastName || !email || !password) {
      setUserError(UserErrors.INCOMPLETE_CREDENTIALS);
      return;
    }

    signUp(accountInfo);

    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
  };

  return (
    <ThemeProvider theme={theme}>
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
          <Box sx={{ m: 1 }}>
            <img
              width="300px"
              src={require('../../../public/assets/SubTract_Logo_Blue.png')}
            />
          </Box>
          <Typography component="h1" variant="h5">
            Create Account
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleFormSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
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
                  autoComplete="family-name"
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
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
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
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
              {userError === UserErrors.DUPLICATE_USER && (
                <Grid item sx={{ alignItems: 'left' }}>
                  <Typography sx={{ color: 'red' }}>
                    <strong>SubTract account already exists. Login.</strong>
                  </Typography>
                </Grid>
              )}
              {userError === UserErrors.INCOMPLETE_CREDENTIALS && (
                <Grid item sx={{ alignItems: 'left' }}>
                  <Typography sx={{ color: 'red' }}>
                    <strong>All fields required to create account.</strong>
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

export default SignupPage;
