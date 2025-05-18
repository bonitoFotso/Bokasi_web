// HabitsPage/index.tsx
import React, { useState, useEffect } from 'react';

import { Add as AddIcon } from '@mui/icons-material';
import { Box, Alert, Button, Container } from '@mui/material';

import useHabitStore from 'src/stores/habitStore';

import HabitList from 'src/components/habit/HabitList';
import HabitTabs from 'src/components/habit/HabitTabs';
import EmptyState from 'src/components/habit/EmptyState';
import PageHeader from 'src/components/habit/PageHeader';
import HabitDialog from 'src/components/habit/HabitDialog';
import HabitFilters from 'src/components/habit/HabitFilters';
import NotificationSnackbar from 'src/components/NotificationSnackbar';


// Interface pour les props TabPanel
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`habit-tabpanel-${index}`}
      aria-labelledby={`habit-tab-${index}`}
      {...other}
      style={{ paddingTop: '24px' }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const HabitsPage: React.FC = () => {
  // État local
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState<number | 'all'>('all');
  const [filterFrequency, setFilterFrequency] = useState<string>('all');
  const [editHabitId, setEditHabitId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
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
    deleteHabit,
    completeHabit,
    uncompleteHabit,
  } = useHabitStore();

  // Chargement initial des données
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchCategories(),
          fetchHabits(),
          fetchTodayHabits(),
        ]);
      } catch (errors) {
        console.error('Erreur lors du chargement des données', errors);
        setSnackbar({
          open: true,
          message: 'Erreur lors du chargement des données',
          severity: 'error',
        });
      }
    };

    loadData();
  }, [fetchCategories, fetchHabits, fetchTodayHabits]);

  // Filtrage des habitudes
  const filteredHabits = habits.filter((habit) => {
    const matchesCategory = filterCategory === 'all' || habit.categoryId === filterCategory;
    const matchesFrequency = filterFrequency === 'all' || habit.frequency === filterFrequency;
    return matchesCategory && matchesFrequency;
  });

  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (habitId?: number) => {
    setEditHabitId(habitId || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditHabitId(null);
  };

  const handleDeleteHabit = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette habitude ?')) {
      try {
        await deleteHabit(id);
        setSnackbar({
          open: true,
          message: 'Habitude supprimée avec succès',
          severity: 'success',
        });
      } catch (errors) {
        console.error('Erreur lors de la suppression', errors);
        setSnackbar({
          open: true,
          message: 'Erreur lors de la suppression de l\'habitude',
          severity: 'error',
        });
      }
    }
  };

  const handleCompleteHabit = async (id: number) => {
    try {
      await completeHabit(id);
      setSnackbar({
        open: true,
        message: 'Habitude marquée comme complétée',
        severity: 'success',
      });
    } catch (errors) {
      console.error('Erreur lors de la complétion', errors);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la complétion de l\'habitude',
        severity: 'error',
      });
    }
  };

  const handleUncompleteHabit = async (id: number) => {
    try {
      await uncompleteHabit(id);
      setSnackbar({
        open: true,
        message: 'Complétion annulée',
        severity: 'success',
      });
    } catch (errors) {
      console.error('Erreur lors de l\'annulation', errors);
      setSnackbar({
        open: true,
        message: 'Erreur lors de l\'annulation de la complétion',
        severity: 'error',
      });
    }
  };

  const handleDialogSuccess = (message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: 'success',
    });
    // Recharger les données
    Promise.all([fetchHabits(), fetchTodayHabits()]);
  };

  const handleDialogError = (message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: 'error',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête de page */}
      <PageHeader onCreateHabit={() => handleOpenDialog()} />

      {/* Affichage des erreurs */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Onglets */}
      <HabitTabs value={tabValue} onChange={handleTabChange} />

      {/* Panneau "Toutes les habitudes" */}
      <TabPanel value={tabValue} index={0}>
        <HabitFilters
          categories={categories}
          filterCategory={filterCategory}
          filterFrequency={filterFrequency}
          onCategoryChange={setFilterCategory}
          onFrequencyChange={setFilterFrequency}
        />

        {filteredHabits.length === 0 && !isLoading ? (
          <EmptyState
            title="Aucune habitude trouvée"
            description="Aucune habitude ne correspond aux filtres sélectionnés."
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Créer ma première habitude
              </Button>
            }
          />
        ) : (
          <HabitList
            habits={filteredHabits}
            todayHabits={todayHabits}
            categories={categories}
            isLoading={isLoading}
            onEdit={handleOpenDialog}
            onDelete={handleDeleteHabit}
            onComplete={handleCompleteHabit}
            onUncomplete={handleUncompleteHabit}
          />
        )}
      </TabPanel>

      {/* Panneau "Aujourd'hui" */}
      <TabPanel value={tabValue} index={1}>
        {todayHabits.length === 0 && !isLoading ? (
          <EmptyState
            title="Aucune habitude pour aujourd'hui"
            description="Vous n'avez pas d'habitudes prévues pour aujourd'hui. Profitez de votre journée libre !"
            action={
              <Button
                variant="outlined"
                onClick={() => setTabValue(0)}
              >
                Voir toutes mes habitudes
              </Button>
            }
          />
        ) : (
          <HabitList
            habits={todayHabits}
            todayHabits={todayHabits}
            categories={categories}
            isLoading={isLoading}
            onEdit={handleOpenDialog}
            onDelete={handleDeleteHabit}
            onComplete={handleCompleteHabit}
            onUncomplete={handleUncompleteHabit}
            showOnlyToday
          />
        )}
      </TabPanel>

      {/* Dialogue pour ajouter/modifier une habitude */}
      <HabitDialog
        open={openDialog}
        habitId={editHabitId}
        categories={categories}
        onClose={handleCloseDialog}
        onSuccess={handleDialogSuccess}
        onError={handleDialogError}
      />

      {/* Snackbar pour les notifications */}
      <NotificationSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Container>
  );
};

export default HabitsPage;