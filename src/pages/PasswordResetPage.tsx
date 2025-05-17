import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { 
  Box, 
  Link, 
  Paper, 
  Alert, 
  Button, 
  Container, 
  TextField, 
  Typography,
  CircularProgress
} from '@mui/material';

import { useAuth, useAuthStatus } from '../hooks/authHooks';

const PasswordResetPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const { isLoading, error, clearError } = useAuthStatus();
  
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) clearError();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword({ email });
      setSubmitted(true);
    } catch (err) {
      // L'erreur est déjà gérée dans le store
      console.error('Erreur de réinitialisation:', err);
    }
  };
  
  if (submitted) {
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
            <Alert severity="success" sx={{ mb: 2 }}>
              Un e-mail de réinitialisation a été envoyé à {email}. 
              Veuillez vérifier votre boîte de réception.
            </Alert>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Retourner à la page de connexion
              </Link>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }
  
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
            Réinitialiser le mot de passe
          </Typography>
          
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Saisissez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse e-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleChange}
              type="email"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Envoyer le lien de réinitialisation'}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Retourner à la page de connexion
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default PasswordResetPage;