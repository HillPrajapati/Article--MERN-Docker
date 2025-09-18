import React from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Chip, Stack, IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../api/axios.js';
import { clearAuth } from '../../redux/slices/authSlice.js';

const Header = () => {
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', { token: localStorage.getItem('refreshToken') });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('refreshToken');
    dispatch(clearAuth());
    window.location.href = '/login';
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#ffffff', color: '#000', zIndex: 1301, boxShadow: 3 }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flex: 1, cursor: 'pointer' }}
          onClick={() => (window.location.href = '/')}
        >
          Knowledge Platform
        </Typography>

        {auth?.user ? (
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* User profile chip with initials */}
            <Chip
              avatar={<Avatar>{auth.user.name[0].toUpperCase()}</Avatar>}
              label={auth.user.name}
              variant="outlined"
              color="primary"
              sx={{ fontWeight: 'bold' }}
            />

            {/* Logout button with icon */}
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button color="inherit" href="/login">Login</Button>
            <Button color="inherit" href="/signup">Signup</Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
