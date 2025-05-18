import React from 'react';

import { Box } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

interface HabitCompletionBadgeProps {
  isCompleted: boolean;
}

const HabitCompletionBadge: React.FC<HabitCompletionBadgeProps> = ({ isCompleted }) => {
  if (!isCompleted) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 2,
        animation: 'fadeInScale 0.5s ease-out',
        '@keyframes fadeInScale': {
          '0%': { opacity: 0, transform: 'scale(0.5)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      }}
    >
      <CheckCircleIcon 
        color="success" 
        sx={{ 
          fontSize: 32,
          filter: 'drop-shadow(0 3px 6px rgba(76, 175, 80, 0.4))',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }} 
      />
    </Box>
  );
};

export default HabitCompletionBadge;