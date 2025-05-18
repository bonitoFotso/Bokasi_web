import type { AxiosInstance } from 'axios';
import type { User, AuthResponse, NewPasswordData, LoginCredentials, RegisterUserData, PasswordResetData, ChangePasswordData, EmailVerificationData } from 'src/type/user.type';

import axios from 'axios';

import useAuthStore from 'src/stores/authStore';


// URL de base de l'API
export const API_URL = 'http://127.0.0.1:8888/api';


export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification depuis Zustand
apiClient.interceptors.request.use((config) => {
  // Récupérer le token depuis le store Zustand
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gestion des erreurs 401 (non authentifié)
    if (error.response?.status === 401) {
      // Utiliser la fonction logout du store pour nettoyer l'état
      useAuthStore.getState().logout();
      // Redirection vers la page de login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Service pour les appels API liés à l'authentification
 */
const authApi = {
  /**
   * Connexion utilisateur
   * @param credentials Informations de connexion
   * @returns Réponse d'authentification avec tokens et info utilisateur
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('Login credentials:', credentials);
    const response = await apiClient.post<AuthResponse>('/users/login/', credentials);
    return response.data;
  },

  /**
   * Inscription utilisateur
   * @param userData Données d'inscription
   * @returns Réponse d'authentification avec tokens et info utilisateur
   */
  register: async (userData: RegisterUserData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/users/register/', userData);
    return response.data;
  },

  /**
   * Rafraîchissement du token d'accès
   * @param refreshToken Token de rafraîchissement
   * @returns Nouveau token d'accès
   */
  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await apiClient.post<{ access: string }>('/users/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },

  /**
   * Mise à jour du profil utilisateur
   * @param userId ID de l'utilisateur
   * @param userData Données à mettre à jour
   * @returns Données utilisateur mises à jour
   */
  updateUser: async (userId: number, userData: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>(`/users/profile/${userId}/`, userData);
    return response.data;
  },

  /**
   * Changement de mot de passe
   * @param passwordData Données de changement de mot de passe
   * @returns Message de confirmation
   */
  changePassword: async (passwordData: ChangePasswordData): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/users/password/change/',
      passwordData
    );
    return response.data;
  },

  /**
   * Demande de réinitialisation de mot de passe
   * @param resetData Données de réinitialisation (email)
   * @returns Message de confirmation
   */
  resetPassword: async (resetData: PasswordResetData): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/users/password/reset/', resetData);
    return response.data;
  },

  /**
   * Définition d'un nouveau mot de passe après réinitialisation
   * @param newPasswordData Données du nouveau mot de passe
   * @returns Message de confirmation
   */
  setNewPassword: async (newPasswordData: NewPasswordData): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/users/password/reset/confirm/',
      newPasswordData
    );
    return response.data;
  },

  /**
   * Vérification de l'email
   * @param verificationData Données de vérification d'email
   * @returns Message de confirmation
   */
  verifyEmail: async (verificationData: EmailVerificationData): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/users/verify-email/',
      verificationData
    );
    return response.data;
  },

  /**
   * Déconnexion (révocation des tokens)
   * @param refreshToken Token de rafraîchissement à révoquer
   * @returns Message de confirmation
   */
  logout: async (refreshToken: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/users/logout/', {
      refresh: refreshToken,
    });
    return response.data;
  }
};

// Intercepteur pour ajouter le token d'authentification aux requêtes
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export default authApi;