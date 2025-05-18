// HabitsPage/components/PageHeader.tsx
import React from 'react';

import { Add as AddIcon } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';

interface PageHeaderProps {
  onCreateHabit: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onCreateHabit }) => (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center" 
      mb={3}
      sx={{
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
        alignItems: { xs: 'stretch', sm: 'center' }
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        Mes Habitudes
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onCreateHabit}
        sx={{
          borderRadius: 2,
          px: 3,
          py: 1.5,
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
          }
        }}
      >
        Nouvelle Habitude
      </Button>
    </Box>
  );

export default PageHeader;