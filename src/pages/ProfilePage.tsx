import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Alert,
  Avatar,
  Button,
  Switch,
  Divider,
  Container,
  TextField,
  Typography,
  FormControlLabel,
  CircularProgress
} from '@mui/material';

import AuthFeedback from '../components/AuthFeedback';
import { useAuth, useAuthStatus } from '../hooks/authHooks';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const { isLoading } = useAuthStatus();
  
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    username: user?.username || '',
    bio: user?.profile?.bio || '',
    dark_mode: user?.profile?.dark_mode || false,
    email_notifications: user?.profile?.email_notifications || false,
    push_notifications: user?.profile?.push_notifications || false,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    const newValue = e.target.type === 'checkbox' ? checked : value;
    setProfileData({ ...profileData, [name]: newValue });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Préparer les données à mettre à jour
      const userData = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        username: profileData.username,
        profile: {
          bio: profileData.bio,
          dark_mode: profileData.dark_mode,
          email_notifications: profileData.email_notifications,
          push_notifications: profileData.push_notifications,
        }
      };
      
      await updateUser(userData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setEditing(false);
      }, 2000);
    } catch (err) {
      console.error('Erreur de mise à jour du profil:', err);
    }
  };
  
  const handleCancel = () => {
    // Réinitialiser les données à l'état initial
    setProfileData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      username: user?.username || '',
      bio: user?.profile?.bio || '',
      dark_mode: user?.profile?.dark_mode || false,
      email_notifications: user?.profile?.email_notifications || false,
      push_notifications: user?.profile?.push_notifications || false,
    });
    setEditing(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const getAvatarText = (): string => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    } else if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    } else if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Profil Utilisateur
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setEditing(!editing)}
              startIcon={<EditIcon />}
              disabled={editing}
            >
              Modifier
            </Button>
          </Box>
          
          <AuthFeedback />
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Profil mis à jour avec succès!
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                bgcolor: 'primary.main',
                fontSize: '2rem'
              }}
              src={user?.profile?.avatar || undefined}
            >
              {getAvatarText()}
            </Avatar>
            <Box sx={{ ml: 3 }}>
              <Typography variant="h5">
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                @{user?.username || 'anonyme'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Membre depuis: {user?.profile?.date_joined 
                  ? new Date(user.profile.date_joined).toLocaleDateString() 
                  : 'N/A'}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ mb: 4 }} />
          
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid >
                <TextField
                  fullWidth
                  label="Prénom"
                  name="first_name"
                  value={profileData.first_name}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Grid>
              <Grid >
                <TextField
                  fullWidth
                  label="Nom"
                  name="last_name"
                  value={profileData.last_name}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Grid>
              <Grid >
                <TextField
                  fullWidth
                  label="Nom d'utilisateur"
                  name="username"
                  value={profileData.username}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Grid>
              <Grid >
                <TextField
                  fullWidth
                  label="Email"
                  value={user?.email || ''}
                  disabled
                  helperText="L'email ne peut pas être modifié"
                />
              </Grid>
              <Grid >
                <TextField
                  fullWidth
                  label="Biographie"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  disabled={!editing}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Préférences
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="dark_mode"
                        checked={profileData.dark_mode}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    }
                    label="Mode sombre"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        name="email_notifications"
                        checked={profileData.email_notifications}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    }
                    label="Notifications par email"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        name="push_notifications"
                        checked={profileData.push_notifications}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    }
                    label="Notifications push"
                  />
                </Stack>
              </Grid>
            </Grid>
            
            {editing && (
              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleCancel}
                  startIcon={<CancelIcon />}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  disabled={isLoading}
                >
                  Enregistrer
                </Button>
              </Box>
            )}
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              component={RouterLink}
              to="/change-password"
              variant="outlined"
            >
              Changer le mot de passe
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              Se déconnecter
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfilePage;