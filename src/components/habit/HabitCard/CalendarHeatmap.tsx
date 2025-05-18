import type { CalendarEntry } from 'src/type/habit.type';

import React from 'react';

import { Box, Tooltip, Typography } from '@mui/material';

interface CalendarHeatmapProps {
  calendar: CalendarEntry[];
}

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ calendar }) => (
    <Box>
      <Typography 
        variant="caption" 
        color="text.secondary" 
        sx={{ mb: 1.5, display: 'block', fontSize: '0.75rem', fontWeight: 500 }}
      >
        30 derniers jours
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={0.75}>
        {calendar
          .slice(-30)
          .map((entry, index) => (
            <Tooltip
              key={index}
              title={`${new Date(entry.date).toLocaleDateString('fr-FR')}: ${
                entry.completed
                  ? 'Complétée ✓'
                  : entry.shouldComplete
                  ? 'Non complétée ✗'
                  : 'Non prévue'
              }`}
              arrow
              placement="top"
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  bgcolor: entry.completed
                    ? 'success.main'
                    : entry.shouldComplete
                    ? 'error.main'
                    : 'grey.300',
                  opacity: entry.completed ? 1 : entry.shouldComplete ? 0.8 : 0.4,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.5)',
                    zIndex: 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }
                }}
              />
            </Tooltip>
          ))}
      </Box>
    </Box>
  );

export default CalendarHeatmap;