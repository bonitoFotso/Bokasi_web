import type { Habit, CalendarEntry } from 'src/type/habit.type';

// HabitsPage/components/HabitHeatmap.tsx
import React from 'react';

import {
  Box,
  Card,
  Chip,
  Stack,
  Tooltip,
  useTheme,
  Typography,
  CardContent,
} from '@mui/material';

interface HabitHeatmapProps {
  habit: Habit;
  monthsToShow?: number;
}

const HabitHeatmap: React.FC<HabitHeatmapProps> = ({
  habit,
  monthsToShow = 12,
}) => {
  const theme = useTheme();
  const calendar = habit.calendar || [];

  // Générer les données pour la heatmap
  const generateHeatmapData = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - monthsToShow);
    startDate.setDate(1); // Premier jour du mois

    const data = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateString = current.toISOString().split('T')[0];
      const entry = calendar.find(e => e.date === dateString);
      
      data.push({
        date: new Date(current),
        dateString,
        entry: entry || null,
        day: current.getDate(),
        month: current.getMonth(),
        year: current.getFullYear(),
        isToday: current.toDateString() === endDate.toDateString(),
      });

      current.setDate(current.getDate() + 1);
    }

    return data;
  };

  // Grouper les données par mois
  const groupDataByMonth = (data: any[]) => {
    const months: { [key: string]: any[] } = {};
    
    data.forEach(item => {
      const monthKey = `${item.year}-${item.month}`;
      if (!months[monthKey]) {
        months[monthKey] = [];
      }
      months[monthKey].push(item);
    });

    return months;
  };

  const heatmapData = generateHeatmapData();
  const monthlyData = groupDataByMonth(heatmapData);

  // Obtenir la couleur selon l'intensité de complétion
  const getIntensityColor = (entry: CalendarEntry | null) => {
    if (!entry) return theme.palette.grey[100];
    
    if (entry.completed) {
      return theme.palette.success.main;
    } else if (entry.shouldComplete) {
      return theme.palette.error.light;
    } else {
      return theme.palette.grey[200];
    }
  };

  // Calculer les statistiques globales
  const totalEntries = calendar.length;
  const completedEntries = calendar.filter(e => e.completed).length;
  const shouldCompleteEntries = calendar.filter(e => e.shouldComplete).length;
  const overallRate = shouldCompleteEntries > 0 ? (completedEntries / shouldCompleteEntries) * 100 : 0;

  // Trouver la plus longue série
  const calculateLongestStreak = () => {
    const completedDates = calendar
      .filter(e => e.completed)
      .map(e => new Date(e.date))
      .sort((a, b) => a.getTime() - b.getTime());

    let longestStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < completedDates.length; i++) {
      const prevDate = completedDates[i - 1];
      const currDate = completedDates[i];
      const diffDays = Math.ceil((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }

    return Math.max(longestStreak, currentStreak);
  };

  const longestStreak = calculateLongestStreak();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">
            Historique sur {monthsToShow} mois
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label={`${completedEntries}/${shouldCompleteEntries} complétées`}
              color="primary"
              variant="outlined"
              size="small"
            />
            <Chip
              label={`${Math.round(overallRate)}% de réussite`}
              color={overallRate >= 80 ? 'success' : overallRate >= 60 ? 'warning' : 'error'}
              variant="filled"
              size="small"
            />
            <Chip
              label={`Série max: ${longestStreak} jours`}
              color="secondary"
              variant="outlined"
              size="small"
            />
          </Stack>
        </Box>

        {/* Légende */}
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={3}>
          <Typography variant="caption" color="text.secondary">
            Moins
          </Typography>
          <Box display="flex" gap={0.5}>
            {[
              theme.palette.grey[100],
              theme.palette.grey[200],
              theme.palette.success.light,
              theme.palette.success.main,
              theme.palette.success.dark,
            ].map((color, index) => (
              <Box
                key={index}
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: color,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary">
            Plus
          </Typography>
        </Box>

        {/* Heatmap */}
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 600 }}>
            {Object.entries(monthlyData).map(([monthKey, days]) => {
              const [year, month] = monthKey.split('-').map(Number);
              const monthName = new Date(year, month, 1).toLocaleDateString('fr-FR', {
                month: 'short',
                year: 'numeric',
              });

              // Organiser les jours par semaine
              const weeks: any[][] = [];
              let currentWeek: any[] = [];

              // Ajouter des cellules vides au début si nécessaire
              const firstDay = days[0];
              if (firstDay) {
                const startDayOfWeek = firstDay.date.getDay();
                const mondayStart = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
                
                for (let i = 0; i < mondayStart; i++) {
                  currentWeek.push(null);
                }
              }

              days.forEach(day => {
                currentWeek.push(day);
                if (currentWeek.length === 7) {
                  weeks.push(currentWeek);
                  currentWeek = [];
                }
              });

              // Ajouter la dernière semaine si elle n'est pas complète
              if (currentWeek.length > 0) {
                while (currentWeek.length < 7) {
                  currentWeek.push(null);
                }
                weeks.push(currentWeek);
              }

              return (
                <Box key={monthKey} sx={{ mb: 2 }}>
                  <Typography variant="caption" fontWeight="bold" sx={{ mb: 1, display: 'block' }}>
                    {monthName}
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={0.5}>
                    {weeks.map((week, weekIndex) => (
                      <Box key={weekIndex} display="flex" gap={0.5}>
                        {week.map((day, dayIndex) => (
                          <Tooltip
                            key={dayIndex}
                            title={
                              day
                                ? `${day.date.toLocaleDateString('fr-FR')}: ${
                                    day.entry?.completed
                                      ? 'Complétée'
                                      : day.entry?.shouldComplete
                                      ? 'Non complétée'
                                      : 'Non prévue'
                                  }`
                                : ''
                            }
                            arrow
                          >
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                bgcolor: day ? getIntensityColor(day.entry) : 'transparent',
                                borderRadius: 1,
                                border: day?.isToday ? '2px solid' : '1px solid',
                                borderColor: day?.isToday ? 'primary.main' : 'divider',
                                cursor: day ? 'pointer' : 'default',
                                transition: 'all 0.2s',
                                '&:hover': day ? {
                                  transform: 'scale(1.5)',
                                  zIndex: 1,
                                  boxShadow: 2,
                                } : {},
                              }}
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    ))}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Statistiques détaillées */}
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight="bold" mb={1}>
            Résumé de la période
          </Typography>
          <Box display="flex" justifyContent="space-around" flexWrap="wrap" gap={2}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                {totalEntries}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Jours enregistrés
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold" color="success.main">
                {completedEntries}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Jours complétés
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold" color="warning.main">
                {shouldCompleteEntries - completedEntries}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Jours manqués
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                color={
                  overallRate >= 80 ? 'success.main' :
                  overallRate >= 60 ? 'warning.main' : 'error.main'
                }
              >
                {Math.round(overallRate)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Taux global
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Message motivationnel */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          {overallRate >= 90 && (
            <Typography variant="body2" color="success.main" fontWeight="medium">
              🏆 Incroyable constance ! Vous êtes un modèle de discipline !
            </Typography>
          )}
          {overallRate >= 75 && overallRate < 90 && (
            <Typography variant="body2" color="primary.main" fontWeight="medium">
              🌟 Excellente régularité ! Vous êtes sur la bonne voie !
            </Typography>
          )}
          {overallRate >= 60 && overallRate < 75 && (
            <Typography variant="body2" color="warning.main" fontWeight="medium">
              💪 Bon travail ! Quelques ajustements et vous serez au top !
            </Typography>
          )}
          {overallRate < 60 && longestStreak > 0 && (
            <Typography variant="body2" color="info.main" fontWeight="medium">
              🚀 Votre meilleure série de {longestStreak} jours montre votre potentiel ! Recommencez !
            </Typography>
          )}
          {overallRate < 60 && longestStreak === 0 && (
            <Typography variant="body2" color="text.secondary" fontWeight="medium">
              🌱 Chaque expert était autrefois un débutant. Votre parcours commence maintenant !
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default HabitHeatmap;