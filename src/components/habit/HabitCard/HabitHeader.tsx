import type { Habit } from 'src/type/habit.type';

import React from 'react';

import { Box, Typography } from '@mui/material';

interface HabitHeaderProps {
  habit: Habit;
  isCompleted: boolean;
}

const HabitHeader: React.FC<HabitHeaderProps> = ({ habit, isCompleted }) => (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="h6"
        component="h2"
        sx={{
          fontWeight: 700,
          mb: 1,
          color: isCompleted ? 'success.dark' : 'text.primary',
          fontSize: '1.25rem',
          lineHeight: 1.3,
          transition: 'color 0.2s ease',
        }}
      >
        {habit.name}
      </Typography>

      {habit.description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ 
            mb: 0,
            lineHeight: 1.6,
            fontStyle: 'italic',
            fontSize: '0.875rem',
            opacity: 0.8,
          }}
        >
          {habit.description}
        </Typography>
      )}
    </Box>
  );

export default HabitHeader;