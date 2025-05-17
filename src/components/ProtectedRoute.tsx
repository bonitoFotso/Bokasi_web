import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

import { Box, CircularProgress } from '@mui/material';

import { useAuthProtection } from 'src/hooks/authHooks';

import useAuthStore from '../stores/authStore';

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

/**
 * Composant de protection de route qui vérifie si l'utilisateur est authentifié
 * Redirige vers la page de connexion si non authentifié
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = '/login',
  children
}) => {
  const location = useLocation();
  const { isAuthenticated } = useAuthProtection();
  const isLoading = useAuthStore(state => state.isLoading);
  
  // Afficher un indicateur de chargement pendant la vérification du token
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  
  // Rendre les composants enfants ou l'outlet (pour les routes imbriquées)
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;