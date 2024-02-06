import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

declare module 'jwt-decode' {
  export interface JwtPayload {
    given_name: string;
    family_name: string;
    email: string;
    picture: string;
  }
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  googleAuth: true;
  picture?: string;
  dateCreated?: string;
}

const defaultTheme = createTheme();

const LoginPage = ({ user, setUser, signUp }): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const login = async (loginInfo) => {
    try {
      const response = await fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo)
      });

      if (!response.ok) throw response;

      const data = await response.json();

      await setUser(data);
      console.log('Successfully logged in!');
      navigate('/dashboard');
    } catch (error) {
      console.log('Error logging in:', error);
    }
  };

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  const handleGoogleLogin = async (response: any) => {
    const responseInfo = jwtDecode(response.credential);

    const user: UserProfile = {
      firstName: responseInfo.given_name,
      lastName: responseInfo.family_name,
      email: responseInfo.email,
      password: responseInfo.sub!,
      googleAuth: true,
      picture: responseInfo.picture
    };

    try {
      const response = await fetch(`/user/checkforaccount?email=${user.email}`);
      if (!response.ok) throw response;
      const data = await response.json();
      if (data[0]) login(user);
      else signUp(user);
    } catch (error) {
      console.log('Error logging in with Google Oauth', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${require('../../../public/assets/SubTract_Main.png')})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#05299E',
            backgroundSize: '1000px',
            backgroundPosition: 'center'
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Avatar
              sx={{
                m: 1,
                bgcolor: '#FF7409',
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              <LockOutlinedIcon />
            </Avatar>
            <Box sx={{ m: 1, display: { xs: 'flex', sm: 'none' } }}>
              <img
                width="300px"
                src={require('../../../public/assets/SubTract_Logo_Blue.png')}
              />
            </Box>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleFormLogin}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
              <Box
                sx={{
                  mt: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '1px dashed grey'
                }}
              >
                <hr />
                <Typography component="h2" variant="h6">
                  Sign In With Google
                </Typography>
                <GoogleOAuthProvider
                  clientId={process.env.REACT_APP_GOOGLE_OUATH_CLIENT_ID!}
                >
                  <GoogleLogin onSuccess={handleGoogleLogin} />
                </GoogleOAuthProvider>
                <hr />
                <Typography component="h2" variant="h6">
                  Don't Have An Account?
                </Typography>
                <Button
                  type="submit"
                  onClick={() => navigate('/signup')}
                  variant="contained"
                  sx={{ mt: 1, mb: 5 }}
                >
                  Sign Up!
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default LoginPage;
