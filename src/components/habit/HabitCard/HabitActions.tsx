import type { Habit } from 'src/type/habit.type';

import React from 'react';

import { Box, Tooltip, IconButton } from '@mui/material';
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface HabitActionsProps {
  habit: Habit;
  isCompleted: boolean;
  shouldCompleteToday?: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
  onUncomplete: (id: number) => void;
  className?: string;
}

const HabitActions: React.FC<HabitActionsProps> = ({
  habit,
  isCompleted,
  shouldCompleteToday,
  onEdit,
  onDelete,
  onComplete,
  onUncomplete,
  className,
}) => (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        opacity: { xs: 1, sm: 0 },
        transform: { xs: 'translateX(0)', sm: 'translateX(20px)' },
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        alignItems: 'center',
      }}
    >
      {shouldCompleteToday && (
        <Box>
          {isCompleted ? (
            <Tooltip title="Annuler la complétion">
              <IconButton
                color="default"
                size="medium"
                onClick={() => onUncomplete(habit.id)}
                sx={{
                  bgcolor: 'background.paper',
                  boxShadow: 3,
                  border: '2px solid',
                  borderColor: 'error.main',
                  width: 48,
                  height: 48,
                  '&:hover': { 
                    bgcolor: 'error.50',
                    transform: 'scale(1.1) rotate(-5deg)',
                    boxShadow: 4,
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <CloseIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Marquer comme complétée">
              <IconButton
                color="success"
                size="medium"
                onClick={() => onComplete(habit.id)}
                sx={{
                  bgcolor: 'success.50',
                  boxShadow: 3,
                  border: '2px solid',
                  borderColor: 'success.main',
                  width: 48,
                  height: 48,
                  '&:hover': { 
                    bgcolor: 'success.100',
                    transform: 'scale(1.1) rotate(5deg)',
                    boxShadow: 4,
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <CheckIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Tooltip title="Modifier l'habitude">
          <IconButton
            color="primary"
            size="small"
            onClick={() => onEdit(habit.id)}
            sx={{
              bgcolor: 'primary.50',
              width: 40,
              height: 40,
              '&:hover': { 
                bgcolor: 'primary.100',
                transform: 'scale(1.15)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <EditIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Supprimer l'habitude">
          <IconButton
            color="error"
            size="small"
            onClick={() => onDelete(habit.id)}
            sx={{
              bgcolor: 'error.50',
              width: 40,
              height: 40,
              '&:hover': { 
                bgcolor: 'error.100',
                transform: 'scale(1.15)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <DeleteIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

export default HabitActions;