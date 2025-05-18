// HabitsPage/HabitDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import {
  Box,
  Grid,
  Link,
  Fade,
  Button,
  Container,
  Typography,
  IconButton,
  Breadcrumbs,
} from '@mui/material';

import useHabitStore from 'src/stores/habitStore';

import HabitCard from 'src/components/habit/HabitCard';
import HabitDialog from 'src/components/habit/HabitDialog';
import HabitHeatmap from 'src/components/habit/HabitHeatmap';
import HabitStatsCard from 'src/components/habit/HabitStatsCard';
import HabitTrendChart from 'src/components/habit/HabitTrendChart';
import HabitCalendarView from 'src/components/habit/HabitCalendarView';
import NotificationSnackbar from 'src/components/NotificationSnackbar';


const HabitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [expandedStats, setExpandedStats] = useState(true); // Ouvert par défaut pour plus de détails
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const {
    selectedHabit,
    categories,
    todayHabits,
    fetchHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit,
  } = useHabitStore();

  useEffect(() => {
    if (id) {
      fetchHabit(parseInt(id));
    }
  }, [id, fetchHabit]);

  const handleBack = () => {
    navigate('/habits');
  };

  const handleEdit = () => {
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedHabit) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette habitude ?')) {
      try {
        await deleteHabit(selectedHabit.id);
        setSnackbar({
          open: true,
          message: 'Habitude supprimée avec succès',
          severity: 'success',
        });
        navigate('/habits');
      } catch (error) {
        console.error('Erreur lors de la suppression', error);
        setSnackbar({
          open: true,
          message: 'Erreur lors de la suppression',
          severity: 'error',
        });
      }
    }
  };

  const handleComplete = async () => {
    if (!selectedHabit) return;
    
    try {
      await completeHabit(selectedHabit.id);
      setSnackbar({
        open: true,
        message: 'Habitude marquée comme complétée',
        severity: 'success',
      });
      // Recharger les données
      fetchHabit(selectedHabit.id);
    } catch (error) {
        console.error('Erreur lors de la complétion', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la complétion',
        severity: 'error',
      });
    }
  };

  const handleUncomplete = async () => {
    if (!selectedHabit) return;
    
    try {
      await uncompleteHabit(selectedHabit.id);
      setSnackbar({
        open: true,
        message: 'Complétion annulée',
        severity: 'success',
      });
      // Recharger les données
      fetchHabit(selectedHabit.id);
    } catch (error) {
        console.error('Erreur lors de l\'annulation', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de l\'annulation',
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
    if (selectedHabit) {
      fetchHabit(selectedHabit.id);
    }
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

  const handleDateClick = (date: string, entry: any) => {
    // Fonction pour gérer le clic sur une date du calendrier
    console.log('Date cliquée:', date, entry);
    // Ici on pourrait ouvrir un modal pour modifier la complétion ou ajouter des notes
  };

  if (!selectedHabit) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography variant="h5" color="text.secondary">
            Chargement des détails de l habitude...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Navigation */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link
            component="button"
            variant="body1"
            onClick={handleBack}
            sx={{ 
              textDecoration: 'none',
              color: 'primary.main',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Mes Habitudes
          </Link>
          <Typography color="text.primary">{selectedHabit.name}</Typography>
        </Breadcrumbs>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton
              onClick={handleBack}
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { boxShadow: 3 }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            
            <Typography variant="h4" fontWeight="bold">
              {selectedHabit.name}
            </Typography>
          </Box>

          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Modifier
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Supprimer
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Carte principale de l'habitude */}
        <Grid>
          <Fade in timeout={300}>
            <div>
              <HabitCard
                habit={selectedHabit}
                categories={categories}
                todayHabits={todayHabits}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onComplete={handleComplete}
                onUncomplete={handleUncomplete}
              />
            </div>
          </Fade>
        </Grid>

        {/* Graphique de tendance */}
        <Grid >
          <Fade in timeout={400}>
            <div>
              <HabitTrendChart habit={selectedHabit} />
            </div>
          </Fade>
        </Grid>

        {/* Statistiques détaillées */}
        <Grid>
          <Fade in timeout={500}>
            <div>
              <HabitStatsCard
                habit={selectedHabit}
                expanded={expandedStats}
                onToggleExpanded={() => setExpandedStats(!expandedStats)}
              />
            </div>
          </Fade>
        </Grid>

        {/* Calendrier navigable */}
        <Grid>
          <Fade in timeout={600}>
            <div>
              <HabitCalendarView 
                habit={selectedHabit} 
                onDateClick={handleDateClick}
              />
            </div>
          </Fade>
        </Grid>

        {/* Heatmap de l'historique */}
        <Grid>
          <Fade in timeout={700}>
            <div>
              <HabitHeatmap habit={selectedHabit} monthsToShow={6} />
            </div>
          </Fade>
        </Grid>
      </Grid>

      {/* Dialogue pour modifier l'habitude */}
      <HabitDialog
        open={openDialog}
        habitId={selectedHabit.id}
        categories={categories}
        onClose={() => setOpenDialog(false)}
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

export default HabitDetailPage;