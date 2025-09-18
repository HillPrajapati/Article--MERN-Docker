import React from 'react';
import TableWrapper from '../components/common/Table/TableWrapper.jsx';
import api from '../api/axios.js';
import { Button, Chip, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

const fetchArticles = async ({ q = '', page = 1, limit = 10 }) => {
  return await api.get('/articles', { params: { q, page, limit } });
};

export default function Articles() {
    const navigate = useNavigate()
  const columns = [
  { field: 'title', title: 'Title' },
  { field: 'createdBy', title: 'Author', render: (r) => r.createdBy?.name || '—' },
  { 
    field: 'tags', 
    title: 'Tags', 
    render: (r) => (
      <Stack direction="row" spacing={1}>
        {r.tags && r.tags.length > 0 ? (
          r.tags.map((tag, idx) => (
            <Chip 
              key={idx} 
              label={tag} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          ))
        ) : '—'}
      </Stack>
    )
  },
  { field: 'createdAt', title: 'Created', render: (r) => new Date(r.createdAt).toLocaleString() }
];

 const actionsRenderer = (row) => (
  <>
    <Tooltip title="View">
      <IconButton
        component={Link}
        to={`/articles/${row._id}`}
        color="primary"
        size="small"
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>
    </Tooltip>

    <Tooltip title="Edit">
      <IconButton
        component={Link}
        to={`/articles/${row._id}/edit`}
        color="secondary"
        size="small"
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </>
);


  return (
    <TableWrapper
      columns={columns}
      fetchFn={fetchArticles}
      pageSize={10}
      actionsRenderer={actionsRenderer}
      searchPlaceHolder={"Search by title & tags"}
      onAdd={() => {
        navigate("/articles/new");
      }}
    />
  );
}
