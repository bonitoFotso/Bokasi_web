import type { Habit, CalendarEntry } from 'src/type/habit.type';

// HabitsPage/components/HabitCalendarView.tsx
import React, { useState } from 'react';

import {
  Today as TodayIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  Grid,
  Chip,
  Stack,
  Tooltip,
  useTheme,
  Typography,
  IconButton,
  CardContent,
} from '@mui/material';

interface HabitCalendarViewProps {
  habit: Habit;
  onDateClick?: (date: string, entry: CalendarEntry) => void;
}

const HabitCalendarView: React.FC<HabitCalendarViewProps> = ({
  habit,
  onDateClick,
}) => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const calendar = habit.calendar || [];

  // Navigation du calendrier
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  // Obtenir les informations du mois actuel
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('fr-FR', { 
    month: 'long', 
    year: 'numeric' 
  });

  // Générer les jours du calendrier
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days = [];

    // Jours du mois précédent (pour compléter la première semaine)
    const prevMonth = new Date(currentYear, currentMonth - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    const startingDayOfWeek = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1; // Lundi = 0

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(currentYear, currentMonth - 1, day);
      days.push({
        date,
        dateString: date.toISOString().split('T')[0],
        day,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      
      days.push({
        date,
        dateString: date.toISOString().split('T')[0],
        day,
        isCurrentMonth: true,
        isToday,
      });
    }

    // Jours du mois suivant (pour compléter la dernière semaine)
    const remainingDays = 42 - days.length; // 6 semaines × 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      days.push({
        date,
        dateString: date.toISOString().split('T')[0],
        day,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Obtenir l'entrée du calendrier pour une date donnée
  const getCalendarEntry = (dateString: string): CalendarEntry | null => calendar.find(entry => entry.date === dateString) || null;

  // Obtenir la couleur de la cellule selon l'état
  const getCellColor = (day: any, entry: CalendarEntry | null) => {
    if (!day.isCurrentMonth) return 'transparent';
    if (!entry) return theme.palette.grey[100];
    
    if (entry.completed) {
      return theme.palette.success.light;
    } else if (entry.shouldComplete) {
      return theme.palette.error.light;
    } else {
      return theme.palette.grey[200];
    }
  };

  // Obtenir l'icône pour la cellule
  const getCellIcon = (entry: CalendarEntry | null) => {
    if (!entry) return null;
    
    if (entry.completed) return '✓';
    if (entry.shouldComplete) return '○';
    return '·';
  };

  // Calculer les statistiques du mois
  const monthStats = calendar.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
  });

  const monthCompleted = monthStats.filter(entry => entry.completed).length;
  const monthShouldComplete = monthStats.filter(entry => entry.shouldComplete).length;
  const monthCompletionRate = monthShouldComplete > 0 ? (monthCompleted / monthShouldComplete) * 100 : 0;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* En-tête du calendrier */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Calendrier des habitudes
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={goToPreviousMonth} size="small">
              <ChevronLeftIcon />
            </IconButton>
            <Box textAlign="center" minWidth={180}>
              <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                {monthName}
              </Typography>
            </Box>
            <IconButton onClick={goToNextMonth} size="small">
              <ChevronRightIcon />
            </IconButton>
            <IconButton onClick={goToCurrentMonth} size="small" color="primary">
              <TodayIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Statistiques du mois */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Chip
            label={`${monthCompleted} complétées`}
            color="success"
            variant="outlined"
            size="small"
          />
          <Chip
            label={`${monthShouldComplete} prévues`}
            color="primary"
            variant="outlined"
            size="small"
          />
          <Chip
            label={`${Math.round(monthCompletionRate)}% de réussite`}
            color={monthCompletionRate >= 80 ? 'success' : monthCompletionRate >= 60 ? 'warning' : 'error'}
            variant="filled"
            size="small"
          />
        </Stack>

        {/* Légende */}
        <Box display="flex" justifyContent="center" gap={3} mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: 'success.light',
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Complétée</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: 'error.light',
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Non complétée</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: 'grey.200',
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Non prévue</Typography>
          </Box>
        </Box>

        {/* En-têtes des jours */}
        <Grid container spacing={0} sx={{ mb: 1 }}>
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((dayName) => (
            <Grid>
              <Box
                sx={{
                  textAlign: 'center',
                  py: 1,
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                }}
              >
                {dayName}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Grille du calendrier */}
        <Grid container spacing={0}>
          {calendarDays.map((day, index) => {
            const entry = getCalendarEntry(day.dateString);
            const cellColor = getCellColor(day, entry);
            const cellIcon = getCellIcon(entry);

            return (
              <Grid>
                <Tooltip
                  title={
                    day.isCurrentMonth && entry
                      ? `${day.date.toLocaleDateString('fr-FR')}: ${
                          entry.completed
                            ? 'Complétée'
                            : entry.shouldComplete
                            ? 'Non complétée'
                            : 'Non prévue'
                        }`
                      : day.date.toLocaleDateString('fr-FR')
                  }
                  arrow
                >
                  <Box
                    sx={{
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: cellColor,
                      border: '1px solid',
                      borderColor: 'divider',
                      cursor: entry && onDateClick ? 'pointer' : 'default',
                      position: 'relative',
                      transition: 'all 0.2s',
                      opacity: day.isCurrentMonth ? 1 : 0.3,
                      '&:hover': entry && onDateClick ? {
                        transform: 'scale(1.1)',
                        zIndex: 1,
                        boxShadow: 2,
                      } : {},
                      ...(day.isToday && {
                        ring: 2,
                        ringColor: 'primary.main',
                        fontWeight: 'bold',
                      }),
                    }}
                    onClick={() => entry && onDateClick && onDateClick(day.dateString, entry)}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: day.isToday ? 'bold' : 'normal',
                        color: day.isCurrentMonth ? 'text.primary' : 'text.disabled',
                      }}
                    >
                      {day.day}
                    </Typography>
                    {cellIcon && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          color: entry?.completed ? 'success.dark' : 'error.dark',
                        }}
                      >
                        {cellIcon}
                      </Box>
                    )}
                  </Box>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>

        {/* Résumé rapide */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {monthCompleted > 0 && monthShouldComplete > 0 ? (
              <>
                Vous avez complété <strong>{monthCompleted}</strong> sur{' '}
                <strong>{monthShouldComplete}</strong> habitudes prévues ce mois.
                {monthCompletionRate >= 80 ? ' 🎉 Excellent travail !' : 
                 monthCompletionRate >= 60 ? ' 👏 Bien joué !' : 
                 ' 💪 Continuez vos efforts !'}
              </>
            ) : (
              'Aucune donnée disponible pour ce mois.'
            )}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HabitCalendarView;