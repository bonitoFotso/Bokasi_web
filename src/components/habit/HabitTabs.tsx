// HabitsPage/components/HabitTabs.tsx
import React from 'react';

import { Box, Tab, Tabs, Badge } from '@mui/material';
import { List as ListIcon, Today as TodayIcon } from '@mui/icons-material';

interface HabitTabsProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
  todayCount?: number;
}

const HabitTabs: React.FC<HabitTabsProps> = ({ value, onChange, todayCount = 0 }) => (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs 
        value={value} 
        onChange={onChange} 
        aria-label="habit tabs"
        sx={{
          '& .MuiTab-root': {
            minHeight: 60,
            fontWeight: 'medium',
            textTransform: 'none',
            fontSize: '1rem',
          }
        }}
      >
        <Tab 
          icon={<ListIcon />}
          iconPosition="start"
          label="Toutes les habitudes" 
          id="habit-tab-0"
          sx={{ mr: 2 }}
        />
        <Tab 
          icon={<TodayIcon />}
          iconPosition="start"
          label={
            <Badge 
              badgeContent={todayCount} 
              color="primary"
              sx={{ '& .MuiBadge-badge': { right: -10, top: -4 } }}
            >
              Aujourd hui
            </Badge>
          }
          id="habit-tab-1"
        />
      </Tabs>
    </Box>
  );

export default HabitTabs;