import React, { useEffect, useState } from 'react';
import { Alert, Box, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Error = ({ message, duration = 4000 }) => {
  const [open, setOpen] = useState(false);
  const [displayMessage, setDisplayMessage] = useState('');

  useEffect(() => {
    if (message) {
      setDisplayMessage(message); // update the displayed message
      setOpen(false); // reset
      const timer = setTimeout(() => setOpen(true), 50); // small delay to trigger animation
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setOpen(false), duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration]);

  if (!displayMessage) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        width: 'auto',
        maxWidth: 400,
      }}
    >
      <Collapse in={open}>
        <Alert
          severity="error"
          variant="filled"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setOpen(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 1, boxShadow: 3 }}
        >
          {displayMessage}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default Error;
