import type { Habit, Category } from 'src/type/habit.type';

import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Card, Grid, useTheme, CardContent } from '@mui/material';

import HabitInfo from './HabitInfo';
import HabitStats from './HabitStats';
import HabitHeader from './HabitHeader';
import HabitActions from './HabitActions';
import { useCategoryInfo } from './hooks/useCategoryInfo';
import HabitCompletionBadge from './HabitCompletionBadge';
import HabitNotificationBadge from './HabitNotificationBadge';
import { useHabitCompletion } from './hooks/useHabitCompletion';



interface HabitCardProps {
  habit: Habit;
  categories: Category[];
  todayHabits: Habit[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
  onUncomplete: (id: number) => void;
  showOnlyToday?: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  categories,
  todayHabits,
  onEdit,
  onDelete,
  onComplete,
  onUncomplete,
  showOnlyToday = false,
}) => {
  const theme = useTheme();
  const categoryInfo = useCategoryInfo(habit.categoryId, categories, theme);
  const { isCompletedToday, shouldCompleteToday } = useHabitCompletion(habit, todayHabits);

  const hasNotifications = habit.notifications && habit.notifications.length > 0;
  const navigate = useNavigate();
    
  const handleDetailClick = () => {
    navigate(`/habits/${habit.id}`);
  }
  return (
    <Card
    
      sx={{
        mb: 2,
        borderLeft: `4px solid ${categoryInfo.color}`,
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        position: 'relative',
        overflow: 'visible',
        borderRadius: 2,
        '&:hover': {
          boxShadow: theme.shadows[12],
          transform: 'translateY(-8px) scale(1.02)',
          '& .action-buttons': {
            opacity: 1,
            transform: 'translateX(0)',
          },
          '& .stats-section': {
            opacity: 1,
          },
        },
        ...(isCompletedToday && {
          background: `linear-gradient(135deg, ${theme.palette.success.light}20 0%, ${theme.palette.background.paper} 100%)`,
          borderLeftColor: 'success.main',
          boxShadow: `0 0 0 1px ${theme.palette.success.light}40`,
        }),
      }}
    >
      {/* Badges de status */}
      <HabitCompletionBadge isCompleted={isCompletedToday || false} />
      <HabitNotificationBadge 
        notifications={habit.notifications} 
        hasCompletion={isCompletedToday || false}
      />

      <CardContent sx={{ pb: '20px !important', px: 3, pt: 3 }}>
        <Grid container spacing={3} alignItems="flex-start">
          <Grid 
          onClick={handleDetailClick}>
            <Box sx={{ pr: isCompletedToday || hasNotifications ? 6 : 0 }}>
              <HabitHeader 
                habit={habit}
                isCompleted={isCompletedToday || false}
              />
              
              <HabitInfo 
                habit={habit}
                categoryInfo={categoryInfo}
                shouldCompleteToday={shouldCompleteToday}
              />
              
              <HabitStats 
                habit={habit}
                className="stats-section"
              />
            </Box>
          </Grid>

          <Grid>
            <HabitActions
              habit={habit}
              isCompleted={isCompletedToday || false}
              shouldCompleteToday={shouldCompleteToday}
              onEdit={onEdit}
              onDelete={onDelete}
              onComplete={onComplete}
              onUncomplete={onUncomplete}
              className="action-buttons"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default HabitCard;