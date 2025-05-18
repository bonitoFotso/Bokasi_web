import type { Habit, Category } from 'src/type/habit.type';

// HabitsPage/components/HabitList.tsx
import React from 'react';

import { Box, Fade, LinearProgress } from '@mui/material';

import HabitCard from './HabitCard';


interface HabitListProps {
  habits: Habit[];
  todayHabits: Habit[];
  categories: Category[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
  onUncomplete: (id: number) => void;
  showOnlyToday?: boolean;
}

const HabitList: React.FC<HabitListProps> = ({
  habits,
  todayHabits,
  categories,
  isLoading,
  onEdit,
  onDelete,
  onComplete,
  onUncomplete,
  showOnlyToday = false,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ mt: 3 }}>
        <LinearProgress sx={{ borderRadius: 1 }} />
      </Box>
    );
  }

  // Trier les habitudes : complétées en bas, non complétées en haut
  const sortedHabits = [...habits].sort((a, b) => {
    const aCompleted = todayHabits.find(h => h.id === a.id)?.shouldCompleteToday === false;
    const bCompleted = todayHabits.find(h => h.id === b.id)?.shouldCompleteToday === false;
    
    if (aCompleted && !bCompleted) return 1;
    if (!aCompleted && bCompleted) return -1;
    return 0;
  });

  return (
    <Box sx={{ mt: 2 }}>
      {sortedHabits.map((habit, index) => (
        <Fade
          key={habit.id}
          in
          timeout={300}
          style={{ transitionDelay: `${index * 50}ms` }}
        >
          <div>
            <HabitCard
              habit={habit}
              categories={categories}
              todayHabits={todayHabits}
              onEdit={onEdit}
              onDelete={onDelete}
              onComplete={onComplete}
              onUncomplete={onUncomplete}
              showOnlyToday={showOnlyToday}
            />
          </div>
        </Fade>
      ))}
    </Box>
  );
};

export default HabitList;