import type {
  User,
  NewPasswordData,
  LoginCredentials,
  RegisterUserData,
  PasswordResetData,
  ChangePasswordData,
  EmailVerificationData,
} from 'src/type/user.type';

import axios from 'axios';
import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { persist, createJSONStorage } from 'zustand/middleware';

import authApi, { API_URL } from 'src/services/authApi';

// Types pour le store d'authentification
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions d'authentification
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  changePassword: (passwordData: ChangePasswordData) => Promise<void>;
  resetPassword: (resetData: PasswordResetData) => Promise<void>;
  setNewPassword: (newPasswordData: NewPasswordData) => Promise<void>;
  verifyEmail: (verificationData: EmailVerificationData) => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  clearError: () => void;
  isTokenExpired: (token: string) => boolean;
}

// Configuration de l'intercepteur axios
const api = axios.create({
  baseURL: API_URL,
});

// Vérifier si un token est expiré
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Création du store avec persistence
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Fonction pour vérifier si le token est expiré
      isTokenExpired,

      // Connexion utilisateur
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authApi.login(credentials);
          const { user, access, refresh } = response;

          // Configuration du token d'authentification pour les futures requêtes
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

          set({
            user,
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Échec de connexion. Veuillez réessayer.',
          });
          throw error;
        }
      },

      // Inscription utilisateur
      register: async (userData: RegisterUserData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authApi.register(userData);
          const { user, access, refresh } = response;

          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

          set({
            user,
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Échec d'inscription. Veuillez réessayer.",
          });
          throw error;
        }
      },

      // Déconnexion
      logout: () => {
        // Supprimer le token d'auth des en-têtes axios
        delete api.defaults.headers.common['Authorization'];

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      // Mettre à jour les informations utilisateur
      updateUser: async (userData: Partial<User>) => {
        try {
          const state = get();
          if (!state.isAuthenticated || !state.user?.id) {
            throw new Error('Utilisateur non authentifié');
          }

          set({ isLoading: true, error: null });

          // Vérifier et rafraîchir le token si nécessaire
          const isTokenValid = await state.refreshAuth();
          if (!isTokenValid) {
            throw new Error('Session expirée');
          }

          const updatedUser = await authApi.updateUser(state.user.id, userData);

          set({
            user: { ...state.user, ...updatedUser },
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Échec de mise à jour. Veuillez réessayer.',
          });
          throw error;
        }
      },

      // Changer le mot de passe
      changePassword: async (passwordData: ChangePasswordData) => {
        try {
          const state = get();
          if (!state.isAuthenticated) {
            throw new Error('Utilisateur non authentifié');
          }

          set({ isLoading: true, error: null });

          const isTokenValid = await state.refreshAuth();
          if (!isTokenValid) {
            throw new Error('Session expirée');
          }

          await authApi.changePassword(passwordData);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              'Échec de changement de mot de passe. Veuillez réessayer.',
          });
          throw error;
        }
      },

      // Demande de réinitialisation de mot de passe
      resetPassword: async (resetData: PasswordResetData) => {
        try {
          set({ isLoading: true, error: null });

          await authApi.resetPassword(resetData);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              'Échec de réinitialisation de mot de passe. Veuillez réessayer.',
          });
          throw error;
        }
      },

      // Définir un nouveau mot de passe après réinitialisation
      setNewPassword: async (newPasswordData: NewPasswordData) => {
        try {
          set({ isLoading: true, error: null });

          await authApi.setNewPassword(newPasswordData);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              'Échec de définition du nouveau mot de passe. Veuillez réessayer.',
          });
          throw error;
        }
      },

      // Vérification de l'email
      verifyEmail: async (verificationData: EmailVerificationData) => {
        try {
          set({ isLoading: true, error: null });

          await authApi.verifyEmail(verificationData);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              "Échec de vérification de l'email. Veuillez réessayer.",
          });
          throw error;
        }
      },

      // Rafraîchir le token d'authentification
      refreshAuth: async (): Promise<boolean> => {
        const state = get();

        // Si pas de token de rafraîchissement, impossible de s'authentifier
        if (!state.refreshToken) {
          return false;
        }

        // Si déjà en cours de chargement, éviter les appels multiples
        if (state.isLoading) {
          return state.isAuthenticated;
        }

        try {
          // Vérifier si le token d'accès est encore valide
          if (state.accessToken && !isTokenExpired(state.accessToken)) {
            return true;
          }

          // Token expiré, essayer de le rafraîchir
          set({ isLoading: true });

          const { access } = await authApi.refreshToken(state.refreshToken);

          // Mettre à jour le token dans les en-têtes axios
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

          set({
            accessToken: access,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        } catch (error) {
          // Si le rafraîchissement échoue, déconnecter l'utilisateur
          console.error('Échec du rafraîchissement du token', error);

          // Ne pas appeler logout() directement pour éviter une boucle infinie
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Session expirée. Veuillez vous reconnecter.',
          });

          // Supprimer le token d'auth des en-têtes axios
          delete api.defaults.headers.common['Authorization'];

          return false;
        }
      },

      // Effacer les erreurs
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Ne pas persister ces propriétés
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Intercepteur pour les appels API (version simplifiée pour éviter les boucles)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Gestion des erreurs 401 (Non autorisé)
    if (error.response?.status === 401) {
      const authStore = useAuthStore.getState();
      const originalRequest = error.config;

      // Si ce n'est pas déjà une tentative de rafraîchissement
      if (!originalRequest._retry && authStore.refreshToken) {
        originalRequest._retry = true;

        try {
          // Tenter un rafraîchissement de token
          const refreshed = await authStore.refreshAuth();

          if (refreshed) {
            // Réessayer la requête originale avec le nouveau token
            originalRequest.headers['Authorization'] = `Bearer ${authStore.accessToken}`;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          // Si le rafraîchissement échoue, on continue avec le rejet
          console.error('Échec du rafraîchissement du token', refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default useAuthStore;
export { api, isTokenExpired };
