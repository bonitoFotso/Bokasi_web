import type { Habit } from 'src/type/habit.type';

import { useMemo } from 'react';

import { getShouldCompleteToday } from '../utils/habitUtils';

export const useHabitCompletion = (habit: Habit, todayHabits: Habit[]) => useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayHabit = todayHabits.find((h) => h.id === habit.id);
    const isCompletedToday =
      habit.completions?.some((completion) => completion.date.split('T')[0] === today) || false;
      const shouldCompleteToday = getShouldCompleteToday(habit);    console.log(isCompletedToday, shouldCompleteToday, habit.id);

    return {
      isCompletedToday,
      shouldCompleteToday,
      todayHabit,
    };
  }, [habit, todayHabits]);
