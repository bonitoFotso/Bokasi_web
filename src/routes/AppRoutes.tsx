import React from 'react';
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';

import RegisterPage from 'src/pages/RegisterPage';

// Composants d'authentification
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import DashboardPage from '../pages/DashboardPage';
// Pages protégées (à implémenter)
import ProtectedRoute from '../components/ProtectedRoute';
import PasswordResetPage from '../pages/PasswordResetPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';

/**
 * Configuration des routes de l'application
 * Gère les routes publiques et protégées
 */
const AppRouter: React.FC = () => (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />
        
        {/* Routes protégées */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
        </Route>
        
        {/* Redirection vers le tableau de bord par défaut ou connexion */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Route 404 - Page non trouvée */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );

export default AppRouter;