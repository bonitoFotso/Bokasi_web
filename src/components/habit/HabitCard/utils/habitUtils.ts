import type { Theme } from '@mui/material';
import type { Habit } from 'src/type/habit.type';

export const formatFrequency = (habit: Habit): string => {
  if (habit.frequency === 'daily') return 'Quotidienne';
  if (habit.frequency === 'weekly') return 'Hebdomadaire';

  // Fréquence personnalisée
  const days = [];
  if (habit.monday) days.push('Lun');
  if (habit.tuesday) days.push('Mar');
  if (habit.wednesday) days.push('Mer');
  if (habit.thursday) days.push('Jeu');
  if (habit.friday) days.push('Ven');
  if (habit.saturday) days.push('Sam');
  if (habit.sunday) days.push('Dim');

  return days.join(', ');
};

export const getRecentCompletionRate = (habit: Habit): number => {
  if (!habit.completions) return 0;

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const recentCompletions = habit.completions.filter((c) => new Date(c.date) >= lastWeek);

  // Estimation basée sur la fréquence
  let expectedCompletions = 7; // daily par défaut
  if (habit.frequency === 'weekly') {
    expectedCompletions = 1;
  } else if (habit.frequency === 'custom') {
    expectedCompletions = [
      habit.monday,
      habit.tuesday,
      habit.wednesday,
      habit.thursday,
      habit.friday,
      habit.saturday,
      habit.sunday,
    ].filter(Boolean).length;
  }

  return Math.min(100, (recentCompletions.length / expectedCompletions) * 100);
};

export const getStreakColor = (streak: number, theme: Theme): string => {
  if (streak >= 30) return theme.palette.error.main;
  if (streak >= 14) return theme.palette.warning.main;
  if (streak >= 7) return theme.palette.success.main;
  return theme.palette.text.secondary;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
};

export const getShouldCompleteToday = (habit: Habit): boolean => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = dimanche, 1 = lundi, ..., 6 = samedi

  switch (habit.frequency) {
    case 'daily':
      return true;

    case 'weekly':
      // Pour les habitudes hebdomadaires, vous pouvez personnaliser cette logique
      // Par exemple, si vous avez un champ 'weeklyDay' qui indique le jour de la semaine
      // return habit.weeklyDay === dayOfWeek;

      // Actuellement retourne true (à adapter selon votre logique métier)
      return true;

    case 'custom':
      // Vérifier selon les jours sélectionnés dans l'habitude
      { const dayMappings = [
        habit.sunday, // 0 - Dimanche
        habit.monday, // 1 - Lundi
        habit.tuesday, // 2 - Mardi
        habit.wednesday, // 3 - Mercredi
        habit.thursday, // 4 - Jeudi
        habit.friday, // 5 - Vendredi
        habit.saturday, // 6 - Samedi
      ];

      return dayMappings[dayOfWeek] || false; }

    default:
      return false;
  }
};

// Version alternative avec plus d'options pour les habitudes hebdomadaires
export const getShouldCompleteTodayAdvanced = (habit: Habit): boolean => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = dimanche, 1 = lundi, ..., 6 = samedi

  switch (habit.frequency) {
    case 'daily':
      return true;

    case 'weekly':
      // Option 1: Si vous avez un champ spécifique pour le jour hebdomadaire
      // if (habit.weeklyDay !== undefined) {
      //   return habit.weeklyDay === dayOfWeek;
      // }

      // Option 2: Utiliser le même système que custom (au moins un jour sélectionné)
      { const weeklyDays = [
        habit.sunday,
        habit.monday,
        habit.tuesday,
        habit.wednesday,
        habit.thursday,
        habit.friday,
        habit.saturday,
      ];

      // Si au moins un jour est sélectionné, vérifier si c'est aujourd'hui
      if (weeklyDays.some((day) => day)) {
        return weeklyDays[dayOfWeek] || false;
      }

      // Par défaut, les habitudes hebdomadaires sont à faire aujourd'hui
      return true; }

    case 'custom':
      // Vérifier selon les jours sélectionnés
      { const dayMappings = [
        habit.sunday, // 0 - Dimanche
        habit.monday, // 1 - Lundi
        habit.tuesday, // 2 - Mardi
        habit.wednesday, // 3 - Mercredi
        habit.thursday, // 4 - Jeudi
        habit.friday, // 5 - Vendredi
        habit.saturday, // 6 - Samedi
      ];

      return dayMappings[dayOfWeek] || false; }

    default:
      return false;
  }
};

// Version avec possibilité d'exclure certaines dates (jours fériés, vacances, etc.)
export const getShouldCompleteTodayWithExclusions = (
  habit: Habit,
  excludedDates: string[] = []
): boolean => {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0]; // Format YYYY-MM-DD

  // Vérifier si aujourd'hui est exclu
  if (excludedDates.includes(todayString)) {
    return false;
  }

  // Puis appliquer la logique normale
  return getShouldCompleteToday(habit);
};