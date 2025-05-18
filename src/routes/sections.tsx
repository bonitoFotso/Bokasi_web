import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import LoginPage from 'src/pages/LoginPage';
import { AuthLayout } from 'src/layouts/auth';
import HabitsPage from 'src/pages/HabitsPage';
import ProfilePage from 'src/pages/ProfilePage';
import useAuthStore from 'src/stores/authStore';
import RegisterPage from 'src/pages/RegisterPage';
import { DashboardLayout } from 'src/layouts/dashboard';
import HabitDetailPage from 'src/pages/HabitDetailPage';
import PasswordResetPage from 'src/pages/PasswordResetPage';
import ChangePasswordPage from 'src/pages/ChangePasswordPage';

// ----------------------------------------------------------------------

// Imports avec lazy loading
const DashboardPage = lazy(() => import('src/pages/dashboard'));
const BlogPage = lazy(() => import('src/pages/blog'));
const UserPage = lazy(() => import('src/pages/user'));
const ProductsPage = lazy(() => import('src/pages/products'));
const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

/**
 * Props pour le composant ProtectedRoute
 */
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
  // Pour éviter les re-rendus excessifs, on n'utilise que ce dont on a besoin
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  
  // Éviter les re-rendus pendant les vérifications d'authentification en cours
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

/**
 * Composant pour afficher un indicateur de chargement lors du lazy loading
 */
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

/**
 * Configuration des routes de l'application
 */
export const routes: RouteObject[] = [
  // Routes protégées du dashboard
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <DashboardLayout>
            <Suspense fallback={<LoadingFallback />}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        ),
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'user', element: <UserPage /> },
          { path: 'products', element: <ProductsPage /> },
          { path: 'blog', element: <BlogPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'change-password', element: <ChangePasswordPage /> },
          {
            path: '/habits',
            element: <HabitsPage />
          },
          {
            path: '/habits/:id',
            element: <HabitDetailPage/>
          },
        ],
      },
    ],
  },
  
  // Routes publiques
  {
    path: 'login',
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
  },
  {
    path: 'register',
    element: (
      <AuthLayout>
        <RegisterPage />
      </AuthLayout>
    ),
  },
  {
    path: 'reset-password',
    element: (
      <AuthLayout>
        <PasswordResetPage />
      </AuthLayout>
    ),
  },

  // Routes d'erreur
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Navigate to="/404" replace /> },
];

export default routes;