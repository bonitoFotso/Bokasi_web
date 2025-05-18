import type { Category, FrequencyType } from 'src/type/habit.type';

// HabitsPage/components/HabitDialog.tsx
import React, { useState, useEffect } from 'react';

import { Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Fade,
  Dialog,
  Select,
  Button,
  Divider,
  MenuItem,
  Checkbox,
  TextField,
  FormGroup,
  InputLabel,
  Typography,
  IconButton,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

import useHabitStore from 'src/stores/habitStore';

interface HabitFormData {
  name: string;
  description: string;
  frequency: FrequencyType;
  categoryId: number | null;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

const initialHabitForm: HabitFormData = {
  name: '',
  description: '',
  frequency: 'daily',
  categoryId: null,
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: true,
  sunday: true,
};

interface HabitDialogProps {
  open: boolean;
  habitId: number | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const HabitDialog: React.FC<HabitDialogProps> = ({
  open,
  habitId,
  categories,
  onClose,
  onSuccess,
  onError,
}) => {
  const [habitForm, setHabitForm] = useState<HabitFormData>(initialHabitForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { habits, createHabit, updateHabit } = useHabitStore();

  const isEditing = habitId !== null;
  const dialogTitle = isEditing ? 'Modifier l\'habitude' : 'Nouvelle habitude';

  // Charger les données de l'habitude si on est en mode édition
  useEffect(() => {
    if (isEditing && habitId && habits.length > 0) {
      const habit = habits.find(h => h.id === habitId);
      if (habit) {
        setHabitForm({
          name: habit.name,
          description: habit.description || '',
          frequency: habit.frequency,
          categoryId: habit.categoryId,
          monday: habit.monday,
          tuesday: habit.tuesday,
          wednesday: habit.wednesday,
          thursday: habit.thursday,
          friday: habit.friday,
          saturday: habit.saturday,
          sunday: habit.sunday,
        });
      }
    } else {
      setHabitForm(initialHabitForm);
    }
  }, [isEditing, habitId, habits]);

  // Réinitialiser le formulaire lors de la fermeture
  useEffect(() => {
    if (!open) {
      setHabitForm(initialHabitForm);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement> | 
    { target: { name?: string; value: unknown } } |
    React.SyntheticEvent<Element, Event>
  ) => {
    // Handle MUI's select event type
    const target = 'target' in e ? e.target : { name: undefined, value: undefined };
    const name = 'name' in target ? target.name : undefined;
    const value = 'value' in target ? target.value : undefined;
    
    if (name) {
      setHabitForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setHabitForm(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async () => {
    if (!habitForm.name.trim()) {
      onError('Le nom de l\'habitude est requis');
      return;
    }

    // Validation pour fréquence personnalisée
    if (habitForm.frequency === 'custom') {
      const hasSelectedDays = Object.entries(habitForm)
        .filter(([key]) => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(key))
        .some(([, value]) => value === true);
      
      if (!hasSelectedDays) {
        onError('Veuillez sélectionner au moins un jour de la semaine');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (isEditing && habitId) {
        await updateHabit(habitId, habitForm);
        onSuccess('Habitude mise à jour avec succès');
      } else {
        await createHabit(habitForm);
        onSuccess('Habitude créée avec succès');
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde', error);
      onError('Erreur lors de la sauvegarde de l\'habitude');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFrequencyChange = (frequency: FrequencyType) => {
    setHabitForm(prev => ({
      ...prev,
      frequency,
      // Réinitialiser les jours selon la fréquence
      ...(frequency === 'daily' ? {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      } : frequency === 'weekly' ? {
        monday: true,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      } : {})
    }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, pr: 6 }}>
        <Typography variant="h5" component="h2" fontWeight="bold">
          {dialogTitle}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            autoFocus
            name="name"
            label="Nom de l'habitude"
            type="text"
            fullWidth
            value={habitForm.name}
            onChange={handleFormChange}
            variant="outlined"
            required
            sx={{ mb: 3 }}
            placeholder="Ex: Faire du sport, Lire, Méditer..."
          />

          <TextField
            name="description"
            label="Description (optionnelle)"
            type="text"
            fullWidth
            value={habitForm.description}
            onChange={handleFormChange}
            variant="outlined"
            multiline
            rows={3}
            sx={{ mb: 3 }}
            placeholder="Décrivez votre habitude, vos objectifs..."
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="category-label">Catégorie</InputLabel>
            <Select
              labelId="category-label"
              name="categoryId"
              value={habitForm.categoryId === null ? '' : habitForm.categoryId}
              label="Catégorie"
              onChange={handleFormChange}
            >
              <MenuItem value="">
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: 'grey.400',
                      mr: 1,
                    }}
                  />
                  Sans catégorie
                </Box>
              </MenuItem>
              {categories.map(category => (
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

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="frequency-label">Fréquence</InputLabel>
            <Select
              labelId="frequency-label"
              name="frequency"
              value={habitForm.frequency}
              label="Fréquence"
              onChange={(e) => handleFrequencyChange(e.target.value as FrequencyType)}
            >
              <MenuItem value="daily">Quotidienne</MenuItem>
              <MenuItem value="weekly">Hebdomadaire</MenuItem>
              <MenuItem value="custom">Personnalisée</MenuItem>
            </Select>
          </FormControl>

          <Fade in={habitForm.frequency === 'custom'} timeout={300}>
            <Box>
              {habitForm.frequency === 'custom' && (
                <>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    Jours de la semaine
                  </Typography>
                  <FormGroup row>
                    {[
                      { key: 'monday', label: 'Lundi' },
                      { key: 'tuesday', label: 'Mardi' },
                      { key: 'wednesday', label: 'Mercredi' },
                      { key: 'thursday', label: 'Jeudi' },
                      { key: 'friday', label: 'Vendredi' },
                      { key: 'saturday', label: 'Samedi' },
                      { key: 'sunday', label: 'Dimanche' },
                    ].map(({ key, label }) => (
                      <FormControlLabel
                        key={key}
                        control={
                          <Checkbox
                            checked={habitForm[key as keyof HabitFormData] as boolean}
                            onChange={handleDayChange}
                            name={key}
                            color="primary"
                          />
                        }
                        label={label}
                        sx={{ minWidth: 130 }}
                      />
                    ))}
                  </FormGroup>
                </>
              )}
            </Box>
          </Fade>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          size="large"
          sx={{ mr: 1 }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!habitForm.name.trim() || isSubmitting}
          size="large"
          sx={{ px: 4 }}
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HabitDialog;