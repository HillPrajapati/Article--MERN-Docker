import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Toolbar } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ width = 240 }) => {
  const navigate = useNavigate();
  const loc = useLocation();

  const items = [
    { label: 'Articles', path: '/articles', icon: <ArticleIcon sx={{ color: '#fff' }} /> },
    { label: 'Create Article', path: '/articles/new', icon: <AddCircleOutlineIcon sx={{ color: '#fff' }} /> },
    { label: 'Profile', path: '/profile', icon: <AccountCircleIcon sx={{ color: '#fff' }} /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          backgroundColor: '#333333', // dark gray/black
          color: '#ffffff',           // text color white
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {items.map(i => (
            <ListItemButton
              key={i.path}
              selected={loc.pathname === i.path}
              onClick={() => navigate(i.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#555555', // slightly lighter gray when selected
                },
                '&:hover': {
                  backgroundColor: '#444444',
                },
              }}
            >
              <ListItemIcon>{i.icon}</ListItemIcon>
              <ListItemText primary={i.label} sx={{ color: '#fff' }} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
