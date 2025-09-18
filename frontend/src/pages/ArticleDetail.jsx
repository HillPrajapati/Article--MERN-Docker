import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Avatar,
  Card,
  CardContent,
  Chip,
  Paper,
  IconButton,
  Tooltip,
  Modal,
  Stack,
  Divider
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';
import Error from '../components/common/Error.jsx';

// -------------------------
// Comment Item Component
// -------------------------
const CommentItem = React.memo(({ comment }) => (
  <Card sx={{ my: 1, p: 2, borderRadius: 2, boxShadow: 2 }}>
    <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      <Avatar sx={{ bgcolor: comment.createdBy ? 'primary.main' : 'grey.500' }}>
        {comment.createdBy?.name ? comment.createdBy.name[0].toUpperCase() : '?'}
      </Avatar>
      <Box>
        <Typography>{comment.content}</Typography>
        <Typography variant="caption" color="text.secondary">
          By {comment.createdBy?.name || 'Anonymous'}
        </Typography>
      </Box>
    </CardContent>
  </Card>
));

// -------------------------
// Comments List Component
// -------------------------
const CommentsList = ({ comments }) => (
  <Box>
    <Typography variant="h6" mb={2}>Comments</Typography>
    {comments.map(c => <CommentItem key={c._id} comment={c} />)}
  </Box>
);

// -------------------------
// Add Comment Component
// -------------------------
const AddComment = ({ newComment, setNewComment, handleComment }) => (
  <Box mb={3}>
    <Typography variant="h6" mb={1}>Add a Comment</Typography>
    <TextField
      fullWidth
      value={newComment}
      onChange={e => setNewComment(e.target.value)}
      placeholder="Write your comment..."
      sx={{ mb: 1, borderRadius: 2 }}
    />
    <Button
      onClick={handleComment}
      variant="contained"
      sx={{ borderRadius: 2, textTransform: 'none' }}
    >
      Submit
    </Button>
  </Box>
);

// -------------------------
// AI Summary Component
// -------------------------
const AISummary = ({ summaryText, showSummary, setShowSummary, handleCopySummary }) => {
  if (!summaryText) return null;

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, position: 'relative', borderRadius: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="subtitle1" fontWeight={500} mb={1}>AI Summary</Typography>
      {showSummary && <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{summaryText}</Typography>}
      <Tooltip title="Copy summary">
        <IconButton
          size="small"
          onClick={handleCopySummary}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Button
        onClick={() => setShowSummary(!showSummary)}
        sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
        variant="outlined"
      >
        {showSummary ? 'Hide Summary' : 'Show Summary'}
      </Button>
    </Paper>
  );
};

// -------------------------
// Revision History Modal
// -------------------------
const RevisionHistoryModal = ({ open, setOpen, revisions }) => (
  <Modal open={open} onClose={() => setOpen(false)}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', md: 600 },
        maxHeight: '80vh',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 3
      }}
    >
      <Typography variant="h6" mb={3}>Revision History</Typography>
      {revisions.length > 0 ? revisions.map((rev) => (
        <Paper key={rev._id} elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
          <Stack direction="row" justifyContent="space-between" mb={1}>
            <Typography variant="subtitle2">Edited at: {new Date(rev.createdAt).toLocaleString()}</Typography>
            <Chip label="Version" size="small" />
          </Stack>
          <Divider sx={{ mb: 1 }} />
          <Typography variant="body1"><strong>Title:</strong> {rev.title}</Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}><strong>Content:</strong> {rev.content}</Typography>
          <Typography variant="body2"><strong>Tags:</strong> {rev.tags?.join(', ') || '—'}</Typography>
        </Paper>
      )) : <Typography>No revisions available</Typography>}
      <Button onClick={() => setOpen(false)} sx={{ mt: 2, borderRadius: 2 }} variant="contained">Close</Button>
    </Box>
  </Modal>
);

// -------------------------
// Main ArticleDetail Component
// -------------------------
export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [err, setErr] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [showSummary, setShowSummary] = useState(true);
  const [revisions, setRevisions] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/articles/${id}`);
      setArticle(res.data.data.article);
      setComments(res.data.data.comments || []);
      if (res.data.data.article?.summary) setSummaryText(res.data.data.article.summary);

      try {
        const revRes = await api.get(`/articles/${id}/revisions`);
        setRevisions(revRes.data.data || []);
      } catch (e) {}
    } catch (e) {
      setErr(e.response?.data?.message || e.message || 'Error');
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleComment = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post(`/comments/${id}`, { content: newComment });
      setNewComment('');
      fetchData();
    } catch (e) {
      setErr(e.response?.data?.message || e.message || 'Error');
    }
  };

  const handleSummarize = async () => {
    try {
      setSummarizing(true);
      const res = await api.post(`/articles/${id}/summary`);
      setSummaryText(res.data.data || res.data);
      setShowSummary(true);
    } catch (e) {
      setErr(e.response?.data?.message || e.message || 'Error');
    } finally { setSummarizing(false); }
  };

  const handleCopySummary = () => navigator.clipboard.writeText(summaryText);

  if (loading && !article) return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>;

  return (
    <Paper elevation={6} sx={{ p: 4, borderRadius: 3, mb: 4, backgroundColor: '#fafafa' }}>
      <Typography variant="h4" fontWeight={600} mb={2}>{article?.title}</Typography>

      <Box mb={2}>
        {article?.tags?.map(tag => (
          <Chip key={tag} label={tag} color="primary" size="small" sx={{ mr: 1, mb: 1 }} />
        ))}
      </Box>

      <Typography variant="body1" mb={3}>{article?.content}</Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={summarizing ? <CircularProgress size={18} color="inherit" /> : null}
          onClick={handleSummarize}
          disabled={summarizing}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          {summarizing ? 'Summarizing...' : 'Summarize by AI'}
        </Button>

        {revisions.length > 0 && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setHistoryOpen(true)}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            View History ({revisions.length})
          </Button>
        )}
      </Stack>

      {/* AI Summary */}
      <AISummary
        summaryText={summaryText}
        showSummary={showSummary}
        setShowSummary={setShowSummary}
        handleCopySummary={handleCopySummary}
      />

      {/* Add Comment */}
      <AddComment
        newComment={newComment}
        setNewComment={setNewComment}
        handleComment={handleComment}
      />

      {/* Comments List */}
      <CommentsList comments={comments} />

      <Error message={err} />

      {/* Revision Modal */}
      <RevisionHistoryModal open={historyOpen} setOpen={setHistoryOpen} revisions={revisions} />
    </Paper>
  );
}
