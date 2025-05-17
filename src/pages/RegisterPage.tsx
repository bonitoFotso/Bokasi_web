import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { 
  Box, 
  Link, 
  Grid, 
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

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { isLoading, error, clearError } = useAuthStatus();
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Vérifier si les mots de passe correspondent
    if (name === 'password' || name === 'password2') {
      if (name === 'password') {
        setPasswordsMatch(value === formData.password2 || formData.password2 === '');
      } else {
        setPasswordsMatch(value === formData.password || value === '');
      }
    }
    
    if (error) clearError();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.password2) {
      setPasswordsMatch(false);
      return;
    }
    
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      // L'erreur est déjà gérée dans le store
      console.error('Erreur d\'inscription:', err);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          mt: 8,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Créer un compte
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {!passwordsMatch && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Les mots de passe ne correspondent pas
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid >
                <TextField
                  required
                  fullWidth
                  id="first_name"
                  label="Prénom"
                  name="first_name"
                  autoComplete="given-name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  id="last_name"
                  label="Nom"
                  name="last_name"
                  autoComplete="family-name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid >
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Nom d'utilisateur"
                  name="username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </Grid>
              <Grid >
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Adresse e-mail"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                />
              </Grid>
              <Grid >
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid >
                <TextField
                  required
                  fullWidth
                  name="password2"
                  label="Confirmer le mot de passe"
                  type={showConfirmPassword ? "text" : "password"}
                  id="password2"
                  autoComplete="new-password"
                  value={formData.password2}
                  onChange={handleChange}
                  error={!passwordsMatch && formData.password2 !== ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={toggleConfirmPasswordVisibility}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading || !passwordsMatch}
            >
              {isLoading ? <CircularProgress size={24} /> : 'S\'inscrire'}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Déjà un compte ? Se connecter
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;