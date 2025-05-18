import type { Habit } from 'src/type/habit.type';

// HabitsPage/components/HabitTrendChart.tsx
import React from 'react';

import {
  Box,
  Card,
  Grid,
  Chip,
  Tooltip,
  useTheme,
  Typography,
  CardContent,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from '@mui/icons-material';

interface HabitTrendChartProps {
  habit: Habit;
}

const HabitTrendChart: React.FC<HabitTrendChartProps> = ({ habit }) => {
  const theme = useTheme();
  const completions = habit.completions || [];

  // Calculer les données des 7 derniers jours
  const getLast7DaysData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateString = date.toDateString();
      
      // Vérifier si l'habitude devrait être complétée ce jour
      const dayOfWeek = date.getDay(); // 0 = dimanche, 1 = lundi, etc.
      const dayProperties = [
        'sunday', 'monday', 'tuesday', 'wednesday', 
        'thursday', 'friday', 'saturday'
      ];
      
      let shouldComplete = false;
      if (habit.frequency === 'daily') {
        shouldComplete = true;
      } else if (habit.frequency === 'weekly') {
        shouldComplete = dayOfWeek === 1; // Lundi par défaut pour hebdomadaire
      } else if (habit.frequency === 'custom') {
        shouldComplete = habit[dayProperties[dayOfWeek] as keyof Habit] as boolean;
      }
      
      // Vérifier si complétée
      const isCompleted = completions.some(c => 
        new Date(c.date).toDateString() === dateString
      );
      
      return {
        date,
        dateString: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
        dayName: date.toLocaleDateString('fr-FR', { weekday: 'long' }),
        shouldComplete,
        isCompleted,
        completionNotes: completions.find(c => 
          new Date(c.date).toDateString() === dateString
        )?.notes
      };
    });
    
    return last7Days;
  };

  // Calculer la tendance
  const calculateTrend = () => {
    const last7Days = getLast7DaysData();
    const last4Days = last7Days.slice(-4);
    const first3Days = last7Days.slice(0, 3);
    
    const recent = last4Days.filter(d => d.shouldComplete && d.isCompleted).length;
    const earlier = first3Days.filter(d => d.shouldComplete && d.isCompleted).length;
    
    const recentRate = recent / Math.max(1, last4Days.filter(d => d.shouldComplete).length);
    const earlierRate = earlier / Math.max(1, first3Days.filter(d => d.shouldComplete).length);
    
    const diff = recentRate - earlierRate;
    
    if (Math.abs(diff) < 0.1) return 'stable';
    return diff > 0 ? 'up' : 'down';
  };

  const last7DaysData = getLast7DaysData();
  const trend = calculateTrend();
  const weeklyCompletions = last7DaysData.filter(d => d.isCompleted).length;
  const weeklyExpected = last7DaysData.filter(d => d.shouldComplete).length;
  const weeklyRate = weeklyExpected > 0 ? (weeklyCompletions / weeklyExpected) * 100 : 0;

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon color="success" />;
      case 'down':
        return <TrendingDownIcon color="error" />;
      default:
        return <TrendingFlatIcon color="warning" />;
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case 'up':
        return 'En progression';
      case 'down':
        return 'En baisse';
      default:
        return 'Stable';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'success';
      case 'down':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Card sx={{ mb: 2, bgcolor: 'background.paper' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Activité des 7 derniers jours
          </Typography>
          <Chip
            icon={getTrendIcon()}
            label={getTrendText()}
            color={getTrendColor() as any}
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Vue en grille des 7 derniers jours */}
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {last7DaysData.map((day, index) => (
            <Grid>
              <Tooltip
                title={
                  day.shouldComplete
                    ? `${day.dayName}: ${day.isCompleted ? 'Complétée' : 'Non complétée'}${
                        day.completionNotes ? ` - ${day.completionNotes}` : ''
                      }`
                    : `${day.dayName}: Pas prévu`
                }
                arrow
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: day.shouldComplete
                      ? day.isCompleted
                        ? 'success.main'
                        : 'error.main'
                      : 'grey.300',
                    bgcolor: day.shouldComplete
                      ? day.isCompleted
                        ? 'success.50'
                        : 'error.50'
                      : 'grey.50',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 2,
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    sx={{ mb: 0.5, fontSize: '0.7rem' }}
                  >
                    {day.dateString}
                  </Typography>
                  
                  {day.shouldComplete ? (
                    day.isCompleted ? (
                      <CheckCircleIcon 
                        color="success" 
                        sx={{ fontSize: 24 }} 
                      />
                    ) : (
                      <UncheckedIcon 
                        color="error" 
                        sx={{ fontSize: 24 }} 
                      />
                    )
                  ) : (
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: 'grey.300',
                        border: '2px solid',
                        borderColor: 'grey.400',
                      }}
                    />
                  )}
                </Box>
              </Tooltip>
            </Grid>
          ))}
        </Grid>

        {/* Statistiques de la semaine */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
            borderRadius: 2,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Cette semaine
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {weeklyCompletions}/{weeklyExpected}
            </Typography>
          </Box>
          
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Taux de réussite
            </Typography>
            <Typography 
              variant="h6" 
              fontWeight="bold"
              color={
                weeklyRate >= 80 ? 'success.main' :
                weeklyRate >= 60 ? 'warning.main' : 'error.main'
              }
            >
              {Math.round(weeklyRate)}%
            </Typography>
          </Box>
          
          <Box textAlign="right">
            <Typography variant="body2" color="text.secondary">
              Tendance
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              {getTrendIcon()}
              <Typography variant="body2" fontWeight="bold" ml={0.5}>
                {getTrendText()}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Message motivationnel basé sur la performance */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          {weeklyRate >= 90 && (
            <Typography variant="body2" color="success.main" fontWeight="medium">
              🎉 Excellente semaine ! Continuez sur cette lancée !
            </Typography>
          )}
          {weeklyRate >= 70 && weeklyRate < 90 && (
            <Typography variant="body2" color="primary.main" fontWeight="medium">
              👏 Bonne performance ! Encore un petit effort !
            </Typography>
          )}
          {weeklyRate >= 50 && weeklyRate < 70 && (
            <Typography variant="body2" color="warning.main" fontWeight="medium">
              💪 Vous pouvez y arriver ! Ne lâchez pas !
            </Typography>
          )}
          {weeklyRate < 50 && (
            <Typography variant="body2" color="error.main" fontWeight="medium">
              🌟 Un nouveau jour, une nouvelle chance ! Vous avez la force !
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default HabitTrendChart;