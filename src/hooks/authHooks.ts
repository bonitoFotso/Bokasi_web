import { useEffect } from 'react';

import useAuthStore from '../stores/authStore';


/**
 * Hook personnalisé pour gérer l'authentification
 * Fournit les fonctions et états liés à l'authentification
 */
export const useAuth = () => {
  const { 
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    changePassword,
    resetPassword,
    setNewPassword,
    verifyEmail,
    clearError
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    changePassword,
    resetPassword,
    setNewPassword,
    verifyEmail,
    clearError
  };
};

/**
 * Hook de protection de route
 * Vérifie si l'utilisateur est authentifié et rafraîchit le token si nécessaire
 */
export const useAuthProtection = () => {
  const { isAuthenticated, refreshAuth } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated) {
        await refreshAuth();
      }
    };

    checkAuth();
    // Rafraîchir le token toutes les 10 minutes
    const interval = setInterval(checkAuth, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated, refreshAuth]);

  return { isAuthenticated };
};

/**
 * Hook pour l'état de chargement et les erreurs d'authentification
 */
export const useAuthStatus = () => {
  const { isLoading, error, clearError } = useAuthStore();

  return { isLoading, error, clearError };
};