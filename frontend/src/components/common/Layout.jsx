// src/components/common/Layout.jsx
import React from 'react';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import { Box } from '@mui/material';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flex: 1, p: 2 }}>
          {children}
        </Box>
      </Box>
    </>
  );
}
