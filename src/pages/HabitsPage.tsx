
import type { Habit, FrequencyType } from 'src/type/habit.type';

import React, { useState, useEffect } from 'react';

import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import {
  Box,
  Tab,
  Card,
  Grid,
  Tabs,
  Chip,
  Stack,
  Alert,
  Button,
  Dialog,
  Select,
  MenuItem,
  useTheme,
  Checkbox,
  Snackbar,
  Container,
  TextField,
  FormGroup,
  IconButton,
  InputLabel,
  Typography,
  CardContent,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
  LinearProgress,
  FormControlLabel
} from '@mui/material';

import useHabitStore from 'src/stores/habitStore';

// Interface pour les props TabPanel
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Composant TabPanel
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`habit-tabpanel-${index}`}
      aria-labelledby={`habit-tab-${index}`}
      {...other}
      style={{ paddingTop: '20px' }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

// Interface pour le formulaire d'habitude
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

// État initial du formulaire
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
  sunday: true
};

const HabitsPage: React.FC = () => {
  const theme = useTheme();
  
  // État local
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState<number | 'all'>('all');
  const [filterFrequency, setFilterFrequency] = useState<string>('all');
  const [editHabitId, setEditHabitId] = useState<number | null>(null);
  const [habitForm, setHabitForm] = useState<HabitFormData>(initialHabitForm);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Récupération des données du store
  const { 
    habits, 
    categories, 
    todayHabits,
    isLoading, 
    error,
    fetchHabits, 
    fetchCategories, 
    fetchTodayHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit
  } = useHabitStore();
  
  // Chargement initial des données
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchCategories(),
          fetchHabits(),
          fetchTodayHabits()
        ]);
      } catch (errors) {
        // Gestion des erreurs de chargement

        console.error('Erreur lors du chargement des données', errors);
      }
    };
    
    loadData();
  }, [fetchCategories, fetchHabits, fetchTodayHabits]);
  
  // Filtrage des habitudes en fonction des filtres sélectionnés
  const filteredHabits = habits.filter(habit => {
    const matchesCategory = filterCategory === 'all' || habit.categoryId === filterCategory;
    const matchesFrequency = filterFrequency === 'all' || habit.frequency === filterFrequency;
    return matchesCategory && matchesFrequency;
  });
  
  // Gestion des onglets
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Ouvrir le dialogue pour ajouter/modifier une habitude
  const handleOpenDialog = (habit?: Habit) => {
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
        sunday: habit.sunday
      });
      setEditHabitId(habit.id);
    } else {
      setHabitForm(initialHabitForm);
      setEditHabitId(null);
    }
    setOpenDialog(true);
  };
  
  // Fermer le dialogue
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setHabitForm(initialHabitForm);
    setEditHabitId(null);
  };
  
  // Gérer les changements dans le formulaire
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | 
    { target: { name?: string; value: unknown } } | 
    React.SyntheticEvent<Element, Event>
  ) => {
    const target = e.target as { name?: string; value: unknown };
    const { name, value } = target;
    if (name) {
      setHabitForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Gérer les changements de checkbox pour les jours personnalisés
  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setHabitForm(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Sauvegarder l'habitude (création ou mise à jour)
  const handleSaveHabit = async () => {
    try {
      if (editHabitId) {
        await updateHabit(editHabitId, habitForm);
        setSnackbar({
          open: true,
          message: 'Habitude mise à jour avec succès',
          severity: 'success'
        });
      } else {
        await createHabit(habitForm);
        setSnackbar({
          open: true,
          message: 'Habitude créée avec succès',
          severity: 'success'
        });
      }
      handleCloseDialog();
      // Recharger les habitudes
      await Promise.all([fetchHabits(), fetchTodayHabits()]);
    } catch (errors) {
      console.error('Erreur lors de la sauvegarde de l\'habitude', errors);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la sauvegarde de l\'habitude',
        severity: 'error'
      });
    }
  };
  
  // Supprimer une habitude
  const handleDeleteHabit = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette habitude ?')) {
      try {
        await deleteHabit(id);
        setSnackbar({
          open: true,
          message: 'Habitude supprimée avec succès',
          severity: 'success'
        });
      } catch (errors) {
        console.error('Erreur lors de la suppression de l\'habitude', errors);
        setSnackbar({
          open: true,
          message: 'Erreur lors de la suppression de l\'habitude',
          severity: 'error'
        });
      }
    }
  };
  
  // Marquer une habitude comme complétée
  const handleCompleteHabit = async (id: number) => {
    try {
      await completeHabit(id);
      setSnackbar({
        open: true,
        message: 'Habitude marquée comme complétée',
        severity: 'success'
      });
    } catch (errors) {
      console.error('Erreur lors de la complétion de l\'habitude', errors);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la complétion de l\'habitude',
        severity: 'error'
      });
    }
  };
  
  // Annuler la complétion d'une habitude
  const handleUncompleteHabit = async (id: number) => {
    try {
      await uncompleteHabit(id);
      setSnackbar({
        open: true,
        message: 'Complétion annulée',
        severity: 'success'
      });
    } catch (errors) {
      console.error('Erreur lors de l\'annulation de la complétion', errors);
      setSnackbar({
        open: true,
        message: 'Erreur lors de l\'annulation de la complétion',
        severity: 'error'
      });
    }
  };
  
  // Fermer la snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Récupérer le nom de la catégorie
  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return 'Sans catégorie';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sans catégorie';
  };
  
  // Récupérer la couleur de la catégorie
  const getCategoryColor = (categoryId: number | null) => {
    if (!categoryId) return theme.palette.grey[500];
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : theme.palette.grey[500];
  };
  
  // Formater la fréquence pour l'affichage
  const formatFrequency = (habit: Habit) => {
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
  
  // Rendu de la carte d'habitude
  const renderHabitCard = (habit: Habit) => {
    // Pour déterminer si l'habitude est complétée aujourd'hui, on vérifie dans les habitudes du jour
    const todayHabit = todayHabits.find(h => h.id === habit.id);
    const isCompletedToday = todayHabit && todayHabit.shouldCompleteToday === false;
    
    return (
      <Card
        key={habit.id}
        sx={{
          mb: 2,
          borderLeft: `5px solid ${getCategoryColor(habit.categoryId)}`,
          transition: 'all 0.2s',
          '&:hover': {
            boxShadow: theme.shadows[4],
            transform: 'translateY(-2px)'
          }
        }}
      >
        <CardContent>
          <Grid container alignItems="center" spacing={2}>
            <Grid>
              <Typography variant="h6" component="h2">
                {habit.name}
              </Typography>
              {habit.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {habit.description}
                </Typography>
              )}
              <Stack direction="row" spacing={1} mt={1}>
                <Chip 
                  size="small" 
                  label={getCategoryName(habit.categoryId)} 
                  sx={{ backgroundColor: getCategoryColor(habit.categoryId), color: '#fff' }} 
                />
                <Chip 
                  size="small" 
                  icon={<CalendarIcon />} 
                  label={formatFrequency(habit)} 
                  variant="outlined" 
                />
                {todayHabit?.shouldCompleteToday && (
                  <Chip 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                    label="À faire aujourd'hui" 
                  />
                )}
              </Stack>
            </Grid>
            
            <Grid>
              <Stack direction="row" spacing={1}>
                {todayHabit?.shouldCompleteToday && (
                  <>
                    {isCompletedToday ? (
                      <IconButton 
                        color="default" 
                        size="small" 
                        onClick={() => handleUncompleteHabit(habit.id)}
                        title="Annuler la complétion"
                      >
                        <CloseIcon />
                      </IconButton>
                    ) : (
                      <IconButton 
                        color="success" 
                        size="small" 
                        onClick={() => handleCompleteHabit(habit.id)}
                        title="Marquer comme complétée"
                      >
                        <CheckIcon />
                      </IconButton>
                    )}
                  </>
                )}
                <IconButton 
                  color="primary" 
                  size="small" 
                  onClick={() => handleOpenDialog(habit)}
                  title="Modifier"
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  color="error" 
                  size="small" 
                  onClick={() => handleDeleteHabit(habit.id)}
                  title="Supprimer"
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mes Habitudes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nouvelle Habitude
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="habit tabs">
          <Tab label="Toutes les habitudes" id="habit-tab-0" />
          <Tab label="Aujourd'hui" id="habit-tab-1" />
        </Tabs>
      </Box>
      
      {/* Panneau "Toutes les habitudes" */}
      <TabPanel value={tabValue} index={0}>
        {/* Filtres */}
        <Box mb={3} p={2} bgcolor="background.paper" borderRadius={1}>
          <Grid container spacing={2} alignItems="center">
            <Grid >
              <Typography variant="subtitle1">
                <FilterListIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                Filtres:
              </Typography>
            </Grid>
            <Grid >
              <FormControl size="small" fullWidth>
                <InputLabel id="category-filter-label">Catégorie</InputLabel>
                <Select
                  labelId="category-filter-label"
                  value={filterCategory}
                  label="Catégorie"
                  onChange={(e) => setFilterCategory(e.target.value as number | 'all')}
                >
                  <MenuItem value="all">Toutes les catégories</MenuItem>
                  <MenuItem value={0}>Sans catégorie</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
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
                  onChange={(e) => setFilterFrequency(e.target.value)}
                >
                  <MenuItem value="all">Toutes les fréquences</MenuItem>
                  <MenuItem value="daily">Quotidienne</MenuItem>
                  <MenuItem value="weekly">Hebdomadaire</MenuItem>
                  <MenuItem value="custom">Personnalisée</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        
        {isLoading ? (
          <LinearProgress />
        ) : filteredHabits.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              Aucune habitude ne correspond aux filtres sélectionnés.
            </Typography>
          </Box>
        ) : (
          filteredHabits.map(habit => renderHabitCard(habit))
        )}
      </TabPanel>
      
      {/* Panneau "Aujourd'hui" */}
      <TabPanel value={tabValue} index={1}>
        {isLoading ? (
          <LinearProgress />
        ) : todayHabits.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              Vous n avez pas d habitudes prévues pour aujourd hui.
            </Typography>
          </Box>
        ) : (
          todayHabits.map(habit => renderHabitCard(habit))
        )}
      </TabPanel>
      
      {/* Dialogue pour ajouter/modifier une habitude */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editHabitId ? 'Modifier l\'habitude' : 'Nouvelle habitude'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nom de l'habitude"
            type="text"
            fullWidth
            value={habitForm.name}
            onChange={handleFormChange}
            variant="outlined"
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="description"
            label="Description (optionnelle)"
            type="text"
            fullWidth
            value={habitForm.description}
            onChange={handleFormChange}
            variant="outlined"
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel id="category-label">Catégorie</InputLabel>
            <Select
              labelId="category-label"
              name="categoryId"
              value={habitForm.categoryId === null ? '' : habitForm.categoryId}
              label="Catégorie"
              onChange={handleFormChange}
            >
              <MenuItem value="">Sans catégorie</MenuItem>
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel id="frequency-label">Fréquence</InputLabel>
            <Select
              labelId="frequency-label"
              name="frequency"
              value={habitForm.frequency}
              label="Fréquence"
              onChange={handleFormChange}
            >
              <MenuItem value="daily">Quotidienne</MenuItem>
              <MenuItem value="weekly">Hebdomadaire</MenuItem>
              <MenuItem value="custom">Personnalisée</MenuItem>
            </Select>
          </FormControl>
          
          {habitForm.frequency === 'custom' && (
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                Jours de la semaine
              </Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={habitForm.monday}
                      onChange={handleDayChange}
                      name="monday"
                    />
                  }
                  label="Lun"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={habitForm.tuesday}
                      onChange={handleDayChange}
                      name="tuesday"
                    />
                  }
                  label="Mar"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={habitForm.wednesday}
                      onChange={handleDayChange}
                      name="wednesday"
                    />
                  }
                  label="Mer"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={habitForm.thursday}
                      onChange={handleDayChange}
                      name="thursday"
                    />
                  }
                  label="Jeu"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={habitForm.friday}
                      onChange={handleDayChange}
                      name="friday"
                    />
                  }
                  label="Ven"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={habitForm.saturday}
                      onChange={handleDayChange}
                      name="saturday"
                    />
                  }
                  label="Sam"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={habitForm.sunday}
                      onChange={handleDayChange}
                      name="sunday"
                    />
                  }
                  label="Dim"
                />
              </FormGroup>
            </Box>
          )}
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Annuler
          </Button>
          <Button 
            onClick={handleSaveHabit} 
            color="primary" 
            variant="contained"
            disabled={!habitForm.name.trim()}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HabitsPage;