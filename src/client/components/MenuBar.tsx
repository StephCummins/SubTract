import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './MaterialUITheme';

const settings = ['Profile', 'Account', 'Logout'];

const MenuBar = ({ user }) => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function stringAvatar(
    first: string,
    last: string
  ): { sx: { color: string; bgcolor: string }; children: string } {
    return {
      sx: {
        color: 'black',
        bgcolor: '#2DD881'
      },
      children: `${first[0]}${last[0]}`
    };
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
        <Container maxWidth={false} disableGutters sx={{ mx: '40px' }}>
          <Toolbar
            disableGutters
            sx={{
              width: '100%',
              display: {
                md: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }
            }}
          >
            <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
              <img
                src={require('../../../public/assets/SubTract_Logo.png')}
                height="50px"
              />
              <Typography
                variant="h5"
                noWrap
                component="a"
                sx={{
                  ml: 3,
                  mt: 1,
                  display: { xs: 'none', md: 'flex' },
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none'
                }}
              >
                {user.firstName ? `Hello ${user.firstName}` : 'Hi There!'}
              </Typography>
            </Box>

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                display: { xs: 'flex', md: 'none' }
              }}
            >
              <img
                src={require('../../../public/assets/SubTract_Logo.png')}
                height="40px"
              />
            </Box>
            <Box sx={{ flexGrow: 0, pr: '80px' }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {user.picture ? (
                    <Avatar alt="" src={user.picture} />
                  ) : user.firstName ? (
                    <Avatar {...stringAvatar(user.firstName, user.lastName)} />
                  ) : (
                    <Avatar alt="" src="/broken-image.jpg" />
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};
export default MenuBar;
