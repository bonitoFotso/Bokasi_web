import type { Habit } from 'src/type/habit.type';

import React from 'react';

import { Chip, Stack } from '@mui/material';
import { CalendarMonth as CalendarIcon } from '@mui/icons-material';

import { formatFrequency } from './utils/habitUtils';

interface HabitInfoProps {
  habit: Habit;
  categoryInfo: { name: string; color: string };
  shouldCompleteToday?: boolean;
}

const HabitInfo: React.FC<HabitInfoProps> = ({ 
  habit, 
  categoryInfo, 
  shouldCompleteToday 
}) => (
    <Stack 
      direction="row" 
      spacing={1} 
      flexWrap="wrap" 
      useFlexGap 
      sx={{ mb: 2.5 }}
    >
      <Chip
        size="small"
        label={categoryInfo.name}
        sx={{
          backgroundColor: categoryInfo.color,
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 28,
          boxShadow: `0 2px 8px ${categoryInfo.color}40`,
          '&:hover': {
            backgroundColor: categoryInfo.color,
            transform: 'scale(1.05)',
          },
          transition: 'transform 0.2s ease',
        }}
      />
      
      <Chip
        size="small"
        icon={<CalendarIcon sx={{ fontSize: 16 }} />}
        label={formatFrequency(habit)}
        variant="outlined"
        sx={{ 
          fontWeight: 500,
          height: 28,
          '& .MuiChip-icon': {
            color: 'primary.main',
          },
        }}
      />
      
      {shouldCompleteToday && (
        <Chip
          size="small"
          color="primary"
          variant="filled"
          label="À faire aujourd'hui"
          sx={{ 
            fontWeight: 600,
            fontSize: '0.75rem',
            height: 28,
            animation: 'pulse 2s infinite',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
            '@keyframes pulse': {
              '0%': { opacity: 1, transform: 'scale(1)' },
              '50%': { opacity: 0.8, transform: 'scale(1.02)' },
              '100%': { opacity: 1, transform: 'scale(1)' },
            }
          }}
        />
      )}
    </Stack>
  );

export default HabitInfo;