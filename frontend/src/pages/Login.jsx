import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, InputAdornment, IconButton, Paper } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/slices/authSlice.js';
import api from '../api/axios.js';
import Error from '../components/common/Error.jsx';
import { validateEmail, validatePassword } from '../helpers/validate.js';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!validateEmail(email)) return setErr('Invalid email');
    if (!validatePassword(password)) return setErr('Password must be 6+ chars');

    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      const payload = res.data.data;
      dispatch(setAuth({ user: payload.user, accessToken: payload.accessToken }));
      localStorage.setItem('refreshToken', payload.refreshToken);
      navigate('/articles');
    } catch (e) {
      setErr(e.response?.data?.message || e.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <Paper elevation={6} sx={{ p: 4, borderRadius: 3, maxWidth: 480, mx: 'auto', mt: 6, backgroundColor: '#fafafa' }}>
      <Typography variant="h5" fontWeight={600} mb={3}>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Email" fullWidth value={email} onChange={e => setEmail(e.target.value)} margin="normal" sx={{ borderRadius: 2 }} />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          value={password}
          onChange={e => setPassword(e.target.value)}
          margin="normal"
          sx={{ borderRadius: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(prev => !prev)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button variant="contained" type="submit" disabled={loading} fullWidth sx={{ mt: 3, borderRadius: 2, textTransform: 'none' }}>
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Login'}
        </Button>
      </form>
      <Box mt={2}>
        <Typography variant="body2">
          Don't have an account?{' '}
          <Link to="/signup" style={{ textDecoration: 'none', color: '#1976d2' }}>Sign up</Link>
        </Typography>
      </Box>
      <Error message={err} />
    </Paper>
  );
}
