import type { Habit } from 'src/type/habit.type';

import React from 'react';

import { Box, Stack, Tooltip, useTheme, Typography, LinearProgress } from '@mui/material';
import { 
  Timeline as StatsIcon,
  AccessTime as TimeIcon,
  LocalFireDepartment as StreakIcon,
} from '@mui/icons-material';

import CalendarHeatmap from './CalendarHeatmap';
import { 
  formatDate, 
  getStreakColor, 
  getRecentCompletionRate 
} from './utils/habitUtils';

interface HabitStatsProps {
  habit: Habit;
  className?: string;
}

const HabitStats: React.FC<HabitStatsProps> = ({ habit, className }) => {
  const theme = useTheme();
  const totalCompletions = habit.completions?.length || 0;
  const streak = habit.streak || 0;
  const completionRate = getRecentCompletionRate(habit);

  return (
    <Box 
      className={className}
      sx={{ 
        opacity: { xs: 1, sm: 0.9 },
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Statistiques principales */}
      <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
        {streak > 0 && (
          <Tooltip title={`Série actuelle: ${streak} jour${streak > 1 ? 's' : ''}`}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <StreakIcon 
                sx={{ 
                  fontSize: 18, 
                  color: getStreakColor(streak, theme),
                }} 
              />
              <Typography 
                variant="body2" 
                fontWeight="bold"
                color={getStreakColor(streak, theme)}
                sx={{ fontSize: '0.875rem' }}
              >
                {streak}
              </Typography>
            </Box>
          </Tooltip>
        )}

        {totalCompletions > 0 && (
          <Tooltip title={`Total: ${totalCompletions} complétion${totalCompletions > 1 ? 's' : ''}`}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <StatsIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.875rem' }}>
                {totalCompletions}
              </Typography>
            </Box>
          </Tooltip>
        )}

        <Tooltip title={`Créée le ${formatDate(habit.createdAt)}`}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <TimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {formatDate(habit.start_date)}
            </Typography>
          </Box>
        </Tooltip>
      </Stack>

      {/* Barre de progression */}
      {completionRate > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Cette semaine
            </Typography>
            <Typography 
              variant="caption" 
              fontWeight="bold" 
              color="primary.main"
              sx={{ fontSize: '0.75rem' }}
            >
              {Math.round(completionRate)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={completionRate}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                transition: 'transform 0.4s ease',
              },
            }}
          />
        </Box>
      )}

      {/* Mini calendrier des 30 derniers jours */}
      {habit.calendar && habit.calendar.length > 0 && (
        <CalendarHeatmap calendar={habit.calendar} />
      )}
    </Box>
  );
};

export default HabitStats;
