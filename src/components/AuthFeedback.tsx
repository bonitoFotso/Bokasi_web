import React from 'react';

import { Box, Alert, CircularProgress } from '@mui/material';

import { useAuthStatus } from '../hooks/authHooks';

interface AuthFeedbackProps {
  loadingMessage?: string;
}

/**
 * Composant pour afficher l'état de l'authentification (chargement, erreurs)
 */
const AuthFeedback: React.FC<AuthFeedbackProps> = ({ 
  loadingMessage = 'Chargement en cours...'
}) => {
  const { isLoading, error, clearError } = useAuthStatus();
  
  if (!isLoading && !error) {
    return null;
  }
  
  return (
    <Box sx={{ mb: 2 }}>
      {isLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={20} />
          <Box>{loadingMessage}</Box>
        </Box>
      )}
      
      {error && (
        <Alert 
          severity="error" 
          onClose={clearError}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default AuthFeedback;