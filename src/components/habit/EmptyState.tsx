// HabitsPage/components/EmptyState.tsx
import React from 'react';

import { Box, Paper, Typography } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon 
} from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  action,
  icon = <TrendingUpIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
}) => (
    <Paper
      elevation={0}
      sx={{
        textAlign: 'center',
        py: 8,
        px: 4,
        bgcolor: 'grey.50',
        border: '2px dashed',
        borderColor: 'grey.300',
        borderRadius: 3,
        mt: 4,
      }}
    >
      <Box mb={3}>
        {icon}
      </Box>
      <Typography 
        variant="h5" 
        component="h2" 
        color="text.secondary" 
        gutterBottom
        sx={{ fontWeight: 'medium' }}
      >
        {title}
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ mb: 4, maxWidth: 400, mx: 'auto', lineHeight: 1.6 }}
      >
        {description}
      </Typography>
      {action && (
        <Box>
          {action}
        </Box>
      )}
    </Paper>
  );

export default EmptyState;