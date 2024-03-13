import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './MaterialUITheme';

const UpdateAvatarPage = ({ user, setUser, setShowMenu }): JSX.Element => {
  const [fileData, setFileData] = useState('');
  const [fileURL, setFileURL] = useState(user.picture);

  const navigate = useNavigate();

  useEffect(() => {
    setShowMenu(true);
  }, []);

  const handleImageChange = (e) => {
    setFileData(e.target.files[0]);
    setFileURL(URL.createObjectURL(e.target.files[0]));
    console.log(fileData);
    console.log('hi there!');
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', fileData);
    formData.append('userId', user.userId);

    try {
      const response = await fetch('/user/uploadavatar', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw response;
      const data = await response.json();
      setUser(data);
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  const stringAvatar = (
    first: string,
    last: string
  ): { sx: { color: string; bgcolor: string }; children: string } => {
    return {
      sx: {
        color: 'black',
        bgcolor: '#2DD881'
      },
      children: `${first[0]}${last[0]}`
    };
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
            Update Avatar
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleImageSubmit}
            sx={{ mt: 3 }}
          >
            <Grid
              container
              spacing={2}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Grid item>
                {user.picture !== null || fileData !== '' ? (
                  <img alt="user avatar" src={fileURL} width="96px" />
                ) : (
                  <IconButton>
                    <Avatar {...stringAvatar(user.firstName, user.lastName)} />
                  </IconButton>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <label>Upload New Avatar:</label>
                <input
                  type="file"
                  name="userAvatar"
                  onChange={handleImageChange}
                  required
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
                Update Avatar
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
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default UpdateAvatarPage;
