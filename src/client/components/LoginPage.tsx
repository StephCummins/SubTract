import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse
} from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import theme from './MaterialUITheme';
import OrangeButton from './OrangeButton';
import UserErrors from '../models/UserErrors';
import type GoogleProfile from '../models/GoogleProfile';

declare module 'jwt-decode' {
  export interface JwtPayload {
    given_name: string;
    family_name: string;
    email: string;
    picture: string;
  }
}

const LoginPage = ({
  setUser,
  signUp,
  userError,
  setUserError,
  userNotAuthenticated,
  setShowMenu
}): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setShowMenu(false);
    checkIfLoggedIn();
  }, []);

  const checkIfLoggedIn = async () => {
    try {
      const response = await fetch(`/user/checkifloggedin`);
      if (!response.ok) throw response;

      const data = await response.json();

      if (data) {
        await setUser(data);
        navigate('/dashboard');
      }
    } catch {
      userNotAuthenticated();
    }
  };

  const login = async (loginInfo: { email: string; password: string }) => {
    setUserError(UserErrors.NONE);

    if (!loginInfo.email || !loginInfo.password) {
      setUserError(UserErrors.INCOMPLETE_CREDENTIALS);
      return;
    }
    try {
      const response = await fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo)
      });

      if (!response.ok) throw response;

      const data = await response.json();
      await setUser(data);
      navigate('/dashboard');
    } catch (error) {
      setUserError(UserErrors.LOGIN_ERROR);
    }
  };

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
    setEmail('');
    setPassword('');
  };

  const handleGoogleLogin = async (response: CredentialResponse) => {
    setUserError(UserErrors.NONE);
    const responseInfo = jwtDecode(response.credential!);

    const user: GoogleProfile = {
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
      setUserError(UserErrors.GOOGLE_ERROR);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={false}
          md={7}
          sx={{
            backgroundImage: `url(${require('../../../public/assets/SubTract_Main.png')})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'primary.main',
            backgroundSize: '100%',
            backgroundPosition: 'center'
          }}
        />
        <Grid item sm={12} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 20,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Avatar
              sx={{
                m: 1,
                bgcolor: 'secondary.main',
                display: { xs: 'none', md: 'flex' }
              }}
            >
              <LockOutlinedIcon />
            </Avatar>
            <Box sx={{ m: 1, display: { sm: 'flex', md: 'none' } }}>
              <img
                width="300px"
                src={require('../../../public/assets/SubTract_Logo_Blue.png')}
              />
            </Box>
            <Box
              component="form"
              noValidate
              onSubmit={handleFormLogin}
              sx={{ px: 3, py: 3, mt: 1 }}
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
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: 'primary.main',
                  '&:active': {
                    transform: 'translateY(4px)'
                  }
                }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid
                  item
                  xs
                  sx={{
                    mb: 5
                  }}
                >
                  {/* <Link href="#" variant="body2">
                    Forgot password?
                  </Link> */}
                </Grid>
                {userError === UserErrors.LOGIN_ERROR && (
                  <Grid item sx={{ alignItems: 'left' }}>
                    <Typography sx={{ color: 'red' }}>
                      <strong>Incorrect Login Credentials!</strong>
                    </Typography>
                  </Grid>
                )}
                {userError === UserErrors.INCOMPLETE_CREDENTIALS && (
                  <Grid item sx={{ alignItems: 'left' }}>
                    <Typography sx={{ color: 'red' }}>
                      <strong>Email and Password Required</strong>
                    </Typography>
                  </Grid>
                )}
                {userError === UserErrors.GOOGLE_ERROR && (
                  <Grid item sx={{ alignItems: 'left' }}>
                    <Typography sx={{ color: 'red' }}>
                      <strong>Google Error Logging In!</strong>
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <Box
                sx={{
                  px: 5,
                  py: 3,
                  mt: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '1px dashed grey'
                }}
              >
                <hr />
                <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                  Sign In With Google
                </Typography>
                <GoogleOAuthProvider
                  clientId={process.env.REACT_APP_GOOGLE_OUATH_CLIENT_ID!}
                >
                  <GoogleLogin onSuccess={handleGoogleLogin} />
                </GoogleOAuthProvider>
                <hr />
                <Typography variant="h5" sx={{ mt: 1 }}>
                  Don't Have An Account?
                </Typography>
                <OrangeButton
                  type={'button'}
                  handleOnClick={() => navigate('/signup')}
                >
                  Sign Up
                </OrangeButton>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default LoginPage;
