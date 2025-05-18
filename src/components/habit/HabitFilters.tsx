import type { Category } from 'src/type/habit.type';

// HabitsPage/components/HabitFilters.tsx
import React from 'react';

import { FilterList as FilterListIcon } from '@mui/icons-material';
import { 
  Box, 
  Grid, 
  Chip, 
  Paper, 
  Select, 
  MenuItem, 
  Typography,
  InputLabel,
  FormControl
} from '@mui/material';

interface HabitFiltersProps {
  categories: Category[];
  filterCategory: number | 'all';
  filterFrequency: string;
  onCategoryChange: (value: number | 'all') => void;
  onFrequencyChange: (value: string) => void;
}

const HabitFilters: React.FC<HabitFiltersProps> = ({
  categories,
  filterCategory,
  filterFrequency,
  onCategoryChange,
  onFrequencyChange,
}) => {
  const hasActiveFilters = filterCategory !== 'all' || filterFrequency !== 'all';

  const clearFilters = () => {
    onCategoryChange('all');
    onFrequencyChange('all');
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        mb: 3, 
        p: 3, 
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography 
          variant="h6" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 'medium'
          }}
        >
          <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
          Filtres
        </Typography>
        {hasActiveFilters && (
          <Chip
            label="Effacer les filtres"
            variant="outlined"
            size="small"
            onClick={clearFilters}
            sx={{ cursor: 'pointer' }}
          />
        )}
      </Box>
      
      <Grid container spacing={3}>
        <Grid>
          <FormControl size="small" fullWidth>
            <InputLabel id="category-filter-label">Catégorie</InputLabel>
            <Select
              labelId="category-filter-label"
              value={filterCategory}
              label="Catégorie"
              onChange={(e) => onCategoryChange(e.target.value as number | 'all')}
            >
              <MenuItem value="all">Toutes les catégories</MenuItem>
              <MenuItem value={0}>Sans catégorie</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: category.color,
                        mr: 1,
                      }}
                    />
                    {category.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid>
          <FormControl size="small" fullWidth>
            <InputLabel id="frequency-filter-label">Fréquence</InputLabel>
            <Select
              labelId="frequency-filter-label"
              value={filterFrequency}
              label="Fréquence"
              onChange={(e) => onFrequencyChange(e.target.value)}
            >
              <MenuItem value="all">Toutes les fréquences</MenuItem>
              <MenuItem value="daily">Quotidienne</MenuItem>
              <MenuItem value="weekly">Hebdomadaire</MenuItem>
              <MenuItem value="custom">Personnalisée</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HabitFilters;