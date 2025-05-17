import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { 
  Box, 
  Paper, 
  Alert, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';

import { useAuth, useAuthStatus } from '../hooks/authHooks';

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { changePassword } = useAuth();
  const { isLoading, error, clearError } = useAuthStatus();
  
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    new_password2: ''
  });
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Vérifier si les nouveaux mots de passe correspondent
    if (name === 'new_password' || name === 'new_password2') {
      if (name === 'new_password') {
        setPasswordsMatch(value === formData.new_password2 || formData.new_password2 === '');
      } else {
        setPasswordsMatch(value === formData.new_password || value === '');
      }
    }
    
    if (error) clearError();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.new_password !== formData.new_password2) {
      setPasswordsMatch(false);
      return;
    }
    
    try {
      await changePassword(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      // L'erreur est déjà gérée dans le store
      console.error('Erreur de changement de mot de passe:', err);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Changer le mot de passe
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {!passwordsMatch && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Les nouveaux mots de passe ne correspondent pas
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Mot de passe changé avec succès! Redirection...
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="old_password"
              label="Mot de passe actuel"
              type={showOldPassword ? "text" : "password"}
              id="old_password"
              value={formData.old_password}
              onChange={handleChange}
              disabled={success}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      edge="end"
                    >
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="new_password"
              label="Nouveau mot de passe"
              type={showNewPassword ? "text" : "password"}
              id="new_password"
              value={formData.new_password}
              onChange={handleChange}
              disabled={success}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="new_password2"
              label="Confirmer le nouveau mot de passe"
              type={showConfirmPassword ? "text" : "password"}
              id="new_password2"
              value={formData.new_password2}
              onChange={handleChange}
              error={!passwordsMatch && formData.new_password2 !== ''}
              disabled={success}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading || !passwordsMatch || success}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Changer le mot de passe'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ChangePasswordPage;