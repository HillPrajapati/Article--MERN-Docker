// layout wrapper
import React from 'react';
import { Box, Toolbar } from '@mui/material';
// common layout
import Header from './components/common/Header.jsx';
import Sidebar from './components/common/Sidebar.jsx';
function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f0f2f5' }}>
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          p: 3,
          mt: 8, // offset for header height
          bgcolor: '#f7f7f7',
          borderRadius: 2,
          boxShadow: 1,
          minHeight: 'calc(100vh - 64px)', // full height minus header
          transition: 'all 0.3s ease',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;

