import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const Loading = () => (
  <Box display='flex' justifyContent='center' alignItems='center' minHeight='40vh'>
    <CircularProgress />
  </Box>
);

export default Loading;
