import type { Notification } from 'src/type/habit.type';

import React from 'react';

import { Box, Badge } from '@mui/material';
import { NotificationsActive as NotificationIcon } from '@mui/icons-material';

interface HabitNotificationBadgeProps {
  notifications?: Notification[];
  hasCompletion: boolean;
}

const HabitNotificationBadge: React.FC<HabitNotificationBadgeProps> = ({ 
  notifications, 
  hasCompletion 
}) => {
  const hasNotifications = notifications && notifications.length > 0;
  const activeNotifications = notifications?.filter(n => n.isActive).length || 0;

  if (!hasNotifications) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        right: hasCompletion ? 56 : 16,
        zIndex: 2,
      }}
    >
      <Badge 
        badgeContent={activeNotifications} 
        color="primary"
        sx={{
          '& .MuiBadge-badge': {
            fontSize: '0.75rem',
            height: 20,
            minWidth: 20,
          },
        }}
      >
        <NotificationIcon 
          sx={{ 
            fontSize: 24,
            color: activeNotifications > 0 ? 'primary.main' : 'text.secondary',
            transition: 'color 0.2s ease',
          }} 
        />
      </Badge>
    </Box>
  );
};

export default HabitNotificationBadge;
