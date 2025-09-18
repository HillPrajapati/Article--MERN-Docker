import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import api from '../api/axios.js';
import { useSelector, useDispatch } from 'react-redux';
import { setAuth, clearAuth } from '../redux/slices/authSlice.js';
import Error from '../components/common/Error.jsx';

export default function Profile() {
  const auth = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [name, setName] = useState(auth.user?.name || '');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { setName(auth.user?.name || ''); }, [auth.user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await api.put('/users/me', { name });
      const updated = res.data.data;
      dispatch(setAuth({ user: updated, accessToken: auth.accessToken }));
      alert('Profile updated');
    } catch (e) {
      setErr(e.response?.data?.message || e.message || 'Error');
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete your account? This cannot be undone.')) return;
    try {
      setLoading(true);
      await api.delete('/users/me');
      localStorage.removeItem('refreshToken');
      dispatch(clearAuth());
      window.location.href = '/signup';
    } catch (e) {
      setErr(e.response?.data?.message || e.message || 'Error');
    } finally { setLoading(false); }
  };

  return (
    <Box maxWidth={600} mx="auto">
      <Typography variant="h5" mb={2}>Profile</Typography>
      <TextField label="Name" fullWidth value={name} onChange={e => setName(e.target.value)} sx={{ mb: 2 }} />
      <TextField label="Email" fullWidth value={auth.user?.email || ''} disabled sx={{ mb: 2 }} />
      <Box display="flex" gap={2}>
        <Button variant="contained" onClick={handleUpdate} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Update'}
        </Button>
        {/* <Button color="error" onClick={handleDelete} disabled={loading}>Delete Account</Button> */}
      </Box>
      <Error message={err} />
    </Box>
  );
}
