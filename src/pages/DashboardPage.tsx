import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { 
  Person as PersonIcon, 
  Logout as LogoutIcon, 
  Settings as SettingsIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import {
  Box,
  Grid,
  Card,
  Paper,
  Button,
  Avatar,
  Divider,
  Container,
  Typography,
  CardContent,
  CardActions
} from '@mui/material';

import { useAuth } from '../hooks/authHooks';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <DashboardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Tableau de bord
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Bienvenue, {user?.first_name || user?.username || user?.email}!
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={3}>
          {/* Carte de profil utilisateur */}
          <Grid >
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'primary.main',
                      mb: 2
                    }}
                    src={user?.profile?.avatar || undefined}
                  >
                    {user?.first_name?.[0] || user?.username?.[0] || user?.email?.[0] || 'U'}
                  </Avatar>
                  <Typography variant="h6" align="center">
                    {user?.first_name} {user?.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    @{user?.username || 'anonyme'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {user?.email}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Dernière connexion:</strong> {user?.profile?.last_login_ip 
                      ? `IP: ${user.profile.last_login_ip}` 
                      : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Membre depuis:</strong> {user?.profile?.date_joined 
                      ? new Date(user.profile.date_joined).toLocaleDateString() 
                      : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Record d activité:</strong> {user?.profile?.streak_record || 0} jours
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<PersonIcon />}
                  component={RouterLink}
                  to="/profile"
                  fullWidth
                >
                  Voir profil
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* Préférences */}
          <Grid >
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Préférences
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Mode sombre:</strong> {user?.profile?.dark_mode ? 'Activé' : 'Désactivé'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Notifications email:</strong> {user?.profile?.email_notifications ? 'Activées' : 'Désactivées'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Notifications push:</strong> {user?.profile?.push_notifications ? 'Activées' : 'Désactivées'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Langue:</strong> {user?.profile?.language || 'Français'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Fuseau horaire:</strong> {user?.profile?.timezone || 'UTC+1'}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<SettingsIcon />}
                  component={RouterLink}
                  to="/profile"
                  fullWidth
                >
                  Modifier préférences
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* Actions rapides */}
          <Grid >
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Actions rapides
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Button 
                    variant="outlined" 
                    component={RouterLink} 
                    to="/profile"
                    startIcon={<PersonIcon />}
                    fullWidth
                  >
                    Modifier profil
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    component={RouterLink} 
                    to="/change-password"
                    startIcon={<SettingsIcon />}
                    fullWidth
                  >
                    Changer mot de passe
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    color="error"
                    onClick={() => logout()}
                    startIcon={<LogoutIcon />}
                    fullWidth
                  >
                    Se déconnecter
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Informations supplémentaires */}
          <Grid >
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                À propos
              </Typography>
              
              <Typography variant="body2" paragraph>
                Ceci est un exemple de tableau de bord utilisant le système d authentification basé sur Zustand. 
                Vous pouvez personnaliser ce tableau de bord en fonction des besoins spécifiques de votre application.
              </Typography>
              
              <Typography variant="body2">
                La gestion d état avec Zustand et le stockage persistant des tokens d authentification permet 
                à l utilisateur de rester connecté même après la fermeture du navigateur, tout en maintenant
                une sécurité optimale grâce au rafraîchissement automatique des tokens.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;