import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import Error from '../components/common/Error.jsx';

export default function ArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/articles/${id}`);
        const article = res.data.data.article;
        setTitle(article.title);
        setContent(article.content);
        setTags((article.tags || []).join(','));
      } catch (e) {
        setErr(e.response?.data?.message || e.message || 'Error');
      } finally { setLoading(false); }
    };
    fetchArticle();
  }, [id]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = { title, content, tags: tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (id) await api.put(`/articles/${id}`, data);
      else await api.post('/articles', data);
      navigate('/articles');
    } catch (e) {
      setErr(e.response?.data?.message || e.message || 'Error');
    } finally { setLoading(false); }
  };

  return (
    <Paper elevation={6} sx={{ p: 4, borderRadius: 3, maxWidth: 800, mx: 'auto', mt: 6, backgroundColor: '#fafafa' }}>
      <Typography variant="h5" fontWeight={600} mb={3}>{id ? 'Edit Article' : 'Create Article'}</Typography>

      <TextField label="Title" fullWidth value={title} onChange={e => setTitle(e.target.value)} sx={{ mb: 2, borderRadius: 2 }} />
      <TextField label="Content" fullWidth multiline minRows={6} value={content} onChange={e => setContent(e.target.value)} sx={{ mb: 2, borderRadius: 2 }} />
      <TextField label="Tags (comma separated)" fullWidth value={tags} onChange={e => setTags(e.target.value)} sx={{ mb: 3, borderRadius: 2 }} />

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        sx={{ borderRadius: 2, textTransform: 'none' }}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : (id ? 'Update' : 'Create')}
      </Button>

      <Error message={err} />
    </Paper>
  );
}
