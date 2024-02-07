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

const settings = ['Profile', 'Account', 'Logout'];

const MenuBar = ({ user }) => {
  console.log(user);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function stringAvatar(first: string, last: string) {
    console.log('IN THE FUNCTION!!!!');
    return {
      sx: {
        color: 'black',
        bgcolor: '#2DD881'
      },
      children: `${first[0]}${last[0]}`
    };
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#05299E' }}>
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
              variant="h6"
              noWrap
              component="a"
              sx={{
                ml: 3,
                mt: 1,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'Roboto',
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
                {/* ||
                  (user.firstName === '' && (
                    <Avatar alt="" src="/broken-image.jpg" />
                  )) || (
                    <Avatar {...stringAvatar(user.firstName, user.lastName)} />
                  )} */}
                {/* {user.picture ? (
                  <Avatar alt="" src={user.picture} />
                ) : (
                  <Avatar {...stringAvatar(user.firstName, user.lastName)} />
                )} */}
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
  );
};
export default MenuBar;
