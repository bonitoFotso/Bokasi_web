import { useEffect, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './app';
import routes from './routes/sections';
import useAuthStore from './stores/authStore';
import { ErrorBoundary } from './routes/components';

// ----------------------------------------------------------------------

/**
 * Composant pour initialiser l'authentification avant le rendu des routes
 */
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const refreshAuth = useAuthStore((state) => state.refreshAuth);
  
  // Effectue une seule tentative de rafraîchissement du token au chargement initial
  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshAuth();
      } catch (error) {
        console.error('Failed to refresh authentication:', error);
      }
    };
    
    initAuth();
    // Ce useEffect ne doit s'exécuter qu'une seule fois au montage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Render des enfants uniquement une fois que la vérification initiale est terminée
  return children;
};

/**
 * Configuration du routeur
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthInitializer>
        <App>
          <Outlet />
        </App>
      </AuthInitializer>
    ),
    errorElement: <ErrorBoundary />,
    children: routes,
  },
]);

// Récupération de l'élément racine et rendu de l'application
const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);