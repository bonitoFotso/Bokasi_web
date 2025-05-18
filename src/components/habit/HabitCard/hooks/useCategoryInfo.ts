import type { Theme } from '@mui/material';
import type { Category } from 'src/type/habit.type';

import { useMemo } from 'react';

export const useCategoryInfo = (
  categoryId: number | null,
  categories: Category[],
  theme: Theme
) => useMemo(() => {
    if (!categoryId) {
      return {
        name: 'Sans catégorie',
        color: theme.palette.grey[500],
      };
    }

    const category = categories.find((c) => c.id === categoryId);
    return category
      ? { name: category.name, color: category.color }
      : { name: 'Sans catégorie', color: theme.palette.grey[500] };
  }, [categoryId, categories, theme.palette.grey]);
