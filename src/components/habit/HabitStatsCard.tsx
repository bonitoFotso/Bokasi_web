import type { Habit } from 'src/type/habit.type';

// HabitsPage/components/HabitStatsCard.tsx
import React from 'react';

import {
  Box,
  Card,
  Grid,
  Chip,
  Stack,
  Divider,
  Collapse,
  Typography,
  IconButton,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  LocalFireDepartment as StreakIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';

interface HabitStatsCardProps {
  habit: Habit;
  expanded?: boolean;
  onToggleExpanded?: () => void;
}

const HabitStatsCard: React.FC<HabitStatsCardProps> = ({
  habit,
  expanded = false,
  onToggleExpanded,
}) => {
  const completions = habit.completions || [];
  const streak = habit.streak || 0;

  // Calculer les statistiques
  const totalCompletions = completions.length;
  const daysSinceStart = Math.ceil(
    (new Date().getTime() - new Date(habit.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Statistiques par période
  const getStatsForPeriod = (days: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const periodCompletions = completions.filter(
      c => new Date(c.date) >= cutoffDate
    );
    
    // Calculer les jours attendus selon la fréquence
    let expectedDays = days;
    if (habit.frequency === 'weekly') {
      expectedDays = Math.ceil(days / 7);
    } else if (habit.frequency === 'custom') {
      const activeDays = [
        habit.monday, habit.tuesday, habit.wednesday, habit.thursday,
        habit.friday, habit.saturday, habit.sunday
      ].filter(Boolean).length;
      expectedDays = Math.ceil((days / 7) * activeDays);
    }
    
    return {
      completed: periodCompletions.length,
      expected: Math.max(1, expectedDays),
      rate: Math.min(100, (periodCompletions.length / Math.max(1, expectedDays)) * 100)
    };
  };

  const weekStats = getStatsForPeriod(7);
  const monthStats = getStatsForPeriod(30);
  const allTimeRate = Math.min(100, (totalCompletions / Math.max(1, daysSinceStart)) * 100);

  // Trouver la meilleure série
  const calculateBestStreak = () => {
    if (completions.length === 0) return 0;
    
    const sortedCompletions = [...completions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let bestStreak = 0;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedCompletions.length; i++) {
      const prevDate = new Date(sortedCompletions[i - 1].date);
      const currDate = new Date(sortedCompletions[i].date);
      const diffDays = Math.ceil((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        bestStreak = Math.max(bestStreak, currentStreak);
        currentStreak = 1;
      }
    }
    
    return Math.max(bestStreak, currentStreak);
  };

  const bestStreak = calculateBestStreak();

  // Progression du mois en cours
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyCompletions = completions.filter(c => {
    const date = new Date(c.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthlyProgress = (monthlyCompletions.length / daysInMonth) * 100;

  return (
    <Card sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Statistiques détaillées
          </Typography>
          {onToggleExpanded && (
            <IconButton 
              onClick={onToggleExpanded}
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            {/* Métriques principales */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid>
                <Box textAlign="center" p={2} bgcolor="primary.50" borderRadius={2}>
                  <StreakIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {streak}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Série actuelle
                  </Typography>
                </Box>
              </Grid>
              
              <Grid>
                <Box textAlign="center" p={2} bgcolor="success.50" borderRadius={2}>
                  <TrendingUpIcon color="success" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {bestStreak}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Meilleure série
                  </Typography>
                </Box>
              </Grid>
              
              <Grid>
                <Box textAlign="center" p={2} bgcolor="warning.50" borderRadius={2}>
                  <CheckCircleIcon color="warning" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {totalCompletions}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total complétions
                  </Typography>
                </Box>
              </Grid>
              
              <Grid>
                <Box textAlign="center" p={2} bgcolor="info.50" borderRadius={2}>
                  <CalendarTodayIcon color="info" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {daysSinceStart}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Jours depuis début
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Taux de complétion par période */}
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Taux de complétion
            </Typography>
            
            <Stack spacing={2}>
              {/* Cette semaine */}
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">Cette semaine</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {weekStats.completed}/{weekStats.expected} ({Math.round(weekStats.rate)}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={weekStats.rate}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      bgcolor: weekStats.rate >= 80 ? 'success.main' : 
                               weekStats.rate >= 60 ? 'warning.main' : 'error.main',
                    },
                  }}
                />
              </Box>

              {/* Ce mois */}
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">Ce mois</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {monthStats.completed}/{monthStats.expected} ({Math.round(monthStats.rate)}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={monthStats.rate}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      bgcolor: monthStats.rate >= 80 ? 'success.main' : 
                               monthStats.rate >= 60 ? 'warning.main' : 'error.main',
                    },
                  }}
                />
              </Box>

              {/* Depuis le début */}
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">Depuis le début</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {Math.round(allTimeRate)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={allTimeRate}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      bgcolor: allTimeRate >= 80 ? 'success.main' : 
                               allTimeRate >= 60 ? 'warning.main' : 'error.main',
                    },
                  }}
                />
              </Box>
            </Stack>

            {/* Récompenses/badges basés sur les performances */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                Réalisations
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {streak >= 7 && (
                  <Chip
                    icon={<StreakIcon />}
                    label="Série d'une semaine"
                    color="success"
                    variant="filled"
                    size="small"
                  />
                )}
                {streak >= 30 && (
                  <Chip
                    icon={<StreakIcon />}
                    label="Série d'un mois"
                    color="warning"
                    variant="filled"
                    size="small"
                  />
                )}
                {totalCompletions >= 50 && (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="50 complétions"
                    color="primary"
                    variant="filled"
                    size="small"
                  />
                )}
                {totalCompletions >= 100 && (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Centenaire"
                    color="secondary"
                    variant="filled"
                    size="small"
                  />
                )}
                {allTimeRate >= 90 && (
                  <Chip
                    icon={<TrendingUpIcon />}
                    label="Performance excellente"
                    color="success"
                    variant="filled"
                    size="small"
                  />
                )}
              </Stack>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default HabitStatsCard;