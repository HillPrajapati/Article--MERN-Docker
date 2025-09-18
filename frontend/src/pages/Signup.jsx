import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, InputAdornment, IconButton, Paper } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/slices/authSlice.js';
import api from '../api/axios.js';
import Error from '../components/common/Error.jsx';
import { validateEmail, validatePassword, validateRequired } from '../helpers/validate.js';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!validateRequired(name)) return setErr('Name required');
    if (!validateEmail(email)) return setErr('Invalid email');
    if (!validatePassword(password)) return setErr('Password must be 6+ chars');

    try {
      setLoading(true);
      const res = await api.post('/auth/signup', { name, email, password });
      const payload = res.data.data;
      dispatch(setAuth({ user: payload.user, accessToken: payload.accessToken }));
      localStorage.setItem('refreshToken', payload.refreshToken);
      navigate('/articles');
    } catch (e) {
      setErr(e.response?.data?.message || e.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <Paper elevation={6} sx={{ p: 4, borderRadius: 3, maxWidth: 480, mx: 'auto', mt: 6, backgroundColor: '#fafafa' }}>
      <Typography variant="h5" fontWeight={600} mb={3}>Sign up</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" fullWidth value={name} onChange={e => setName(e.target.value)} margin="normal" sx={{ borderRadius: 2 }} />
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
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Signup'}
        </Button>
      </form>
      <Box mt={2}>
        <Typography variant="body2">
          Already have an account?{' '}
          <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>Login</Link>
        </Typography>
      </Box>
      <Error message={err} />
    </Paper>
  );
}
