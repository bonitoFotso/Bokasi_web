import type { SlideProps } from '@mui/material';

// HabitsPage/components/NotificationSnackbar.tsx
import React from 'react';

import { Alert, Slide, Snackbar } from '@mui/material';

interface NotificationSnackbarProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  autoHideDuration?: number;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 6000,
}) => (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={SlideTransition}
      sx={{
        '& .MuiSnackbarContent-root': {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        }
      }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity} 
        sx={{ 
          width: '100%',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          '& .MuiAlert-icon': {
            fontSize: 24,
          },
          '& .MuiAlert-message': {
            fontSize: '1rem',
            fontWeight: 'medium',
          }
        }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );

export default NotificationSnackbar;