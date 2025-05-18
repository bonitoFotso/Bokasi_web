import type { Habit, Category, HabitStats, Notification, HabitDetailResponse } from 'src/type/habit.type';

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

import habitService from 'src/services/habitService';


// Interface pour le state du store
interface HabitState {
  // State
  categories: Category[];
  habits: Habit[];
  todayHabits: Habit[];
  habitStats: HabitStats | null;
  notifications: Notification[];
  selectedHabit: HabitDetailResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions pour les catégories
  fetchCategories: () => Promise<Category[]>;
  fetchCategory: (id: number) => Promise<Category>;
  createCategory: (category: Partial<Category>) => Promise<Category>;
  updateCategory: (id: number, category: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: number) => Promise<void>;

  // Actions pour les habitudes
  fetchHabits: (params?: { category?: number; frequency?: string }) => Promise<Habit[]>;
  fetchHabit: (id: number) => Promise<HabitDetailResponse>;
  createHabit: (habit: Partial<Habit>) => Promise<Habit>;
  updateHabit: (id: number, habit: Partial<Habit>) => Promise<Habit>;
  deleteHabit: (id: number) => Promise<void>;

  // Actions pour les complétions d'habitudes
  completeHabit: (id: number, data?: { date?: string; notes?: string }) => Promise<void>;
  uncompleteHabit: (id: number, data?: { date?: string }) => Promise<void>;

  // Actions pour les habitudes du jour
  fetchTodayHabits: () => Promise<Habit[]>;

  // Actions pour les statistiques
  fetchHabitStats: () => Promise<HabitStats>;

  // Actions pour les notifications
  fetchNotifications: () => Promise<Notification[]>;
  createNotification: (notification: Partial<Notification>) => Promise<Notification>;
  updateNotification: (id: number, notification: Partial<Notification>) => Promise<Notification>;
  deleteNotification: (id: number) => Promise<void>;

  // Helpers
  clearError: () => void;
  setSelectedHabit: (habit: HabitDetailResponse | null) => void;
}

// Création du store
const useHabitStore = create<HabitState>()(
  devtools(
    persist(
      (set, get) => ({
        // État initial
        categories: [],
        habits: [],
        todayHabits: [],
        habitStats: null,
        notifications: [],
        selectedHabit: null,
        isLoading: false,
        error: null,

        // Actions pour les catégories
        fetchCategories: async () => {
          try {
            set({ isLoading: true, error: null });
            const categories = await habitService.getCategories();
            set({ categories, isLoading: false });
            return categories;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Erreur lors de la récupération des catégories',
            });
            throw error;
          }
        },

        fetchCategory: async (id: number) => {
          try {
            set({ isLoading: true, error: null });
            const category = await habitService.getCategory(id);
            set({ isLoading: false });
            return category;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Erreur lors de la récupération de la catégorie',
            });
            throw error;
          }
        },

        createCategory: async (category: Partial<Category>) => {
          try {
            set({ isLoading: true, error: null });
            const newCategory = await habitService.createCategory(category);

            // Mettre à jour la liste des catégories
            set((state) => ({
              categories: [...state.categories, newCategory],
              isLoading: false,
            }));

            return newCategory;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Erreur lors de la création de la catégorie',
            });
            throw error;
          }
        },

        updateCategory: async (id: number, category: Partial<Category>) => {
          try {
            set({ isLoading: true, error: null });
            const updatedCategory = await habitService.updateCategory(id, category);

            // Mettre à jour la liste des catégories
            set((state) => ({
              categories: state.categories.map((c) => (c.id === id ? updatedCategory : c)),
              isLoading: false,
            }));

            return updatedCategory;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Erreur lors de la mise à jour de la catégorie',
            });
            throw error;
          }
        },

        deleteCategory: async (id: number) => {
          try {
            set({ isLoading: true, error: null });
            await habitService.deleteCategory(id);

            // Mettre à jour la liste des catégories
            set((state) => ({
              categories: state.categories.filter((c) => c.id !== id),
              isLoading: false,
            }));
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Erreur lors de la suppression de la catégorie',
            });
            throw error;
          }
        },

        // Actions pour les habitudes
        fetchHabits: async (params?: { category?: number; frequency?: string }) => {
          try {
            set({ isLoading: true, error: null });
            const habits = await habitService.getHabits(params);
            set({ habits, isLoading: false });
            return habits;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Erreur lors de la récupération des habitudes',
            });
            throw error;
          }
        },

        fetchHabit: async (id: number) => {
          try {
            set({ isLoading: true, error: null });
            const habit = (await habitService.getHabit(id)) as HabitDetailResponse;
            set({ selectedHabit: habit, isLoading: false });
            return habit;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || "Erreur lors de la récupération de l'habitude",
            });
            throw error;
          }
        },

        createHabit: async (habit: Partial<Habit>) => {
          try {
            set({ isLoading: true, error: null });
            const newHabit = await habitService.createHabit(habit);

            // Mettre à jour la liste des habitudes
            set((state) => ({
              habits: [...state.habits, newHabit],
              isLoading: false,
            }));

            return newHabit;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || "Erreur lors de la création de l'habitude",
            });
            throw error;
          }
        },

        updateHabit: async (id: number, habit: Partial<Habit>) => {
          try {
            set({ isLoading: true, error: null });
            const updatedHabit = await habitService.updateHabit(id, habit);

            // Mettre à jour les listes d'habitudes concernées
            set((state) => ({
              habits: state.habits.map((h) => (h.id === id ? updatedHabit : h)),
              todayHabits: state.todayHabits.map((h) => (h.id === id ? updatedHabit : h)),
              selectedHabit:
                state.selectedHabit?.id === id
                  ? ({ ...state.selectedHabit, ...updatedHabit } as HabitDetailResponse)
                  : state.selectedHabit,
              isLoading: false,
            }));

            return updatedHabit;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || "Erreur lors de la mise à jour de l'habitude",
            });
            throw error;
          }
        },

        deleteHabit: async (id: number) => {
          try {
            set({ isLoading: true, error: null });
            await habitService.deleteHabit(id);

            // Mettre à jour les listes d'habitudes
            set((state) => ({
              habits: state.habits.filter((h) => h.id !== id),
              todayHabits: state.todayHabits.filter((h) => h.id !== id),
              selectedHabit: state.selectedHabit?.id === id ? null : state.selectedHabit,
              isLoading: false,
            }));
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || "Erreur lors de la suppression de l'habitude",
            });
            throw error;
          }
        },

        // Compléter une habitude
        completeHabit: async (id: number, data?: { date?: string; notes?: string }) => {
          try {
            set({ isLoading: true, error: null });
            await habitService.completeHabit(id, data);

            // Actualiser les habitudes du jour après la complétion
            const todayHabits = await habitService.getTodayHabits();

            // Si l'habitude sélectionnée est celle qu'on vient de compléter, la rafraîchir aussi
            let updatedSelectedHabit = get().selectedHabit;
            if (updatedSelectedHabit?.id === id) {
              updatedSelectedHabit = (await habitService.getHabit(id)) as HabitDetailResponse;
            }

            set({
              todayHabits,
              selectedHabit: updatedSelectedHabit,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || "Erreur lors de la complétion de l'habitude",
            });
            throw error;
          }
        },

        // Annuler la complétion d'une habitude
        uncompleteHabit: async (id: number, data?: { date?: string }) => {
          try {
            set({ isLoading: true, error: null });
            await habitService.uncompleteHabit(id, data);

            // Actualiser les habitudes du jour après l'annulation
            const todayHabits = await habitService.getTodayHabits();

            // Si l'habitude sélectionnée est celle qu'on vient de modifier, la rafraîchir aussi
            let updatedSelectedHabit = get().selectedHabit;
            if (updatedSelectedHabit?.id === id) {
              updatedSelectedHabit = (await habitService.getHabit(id)) as HabitDetailResponse;
            }

            set({
              todayHabits,
              selectedHabit: updatedSelectedHabit,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || "Erreur lors de l'annulation de la complétion",
            });
            throw error;
          }
        },

        // Récupérer les habitudes du jourb
        fetchTodayHabits: async () => {
          try {
            set({ isLoading: true, error: null });
            const todayHabits = await habitService.getTodayHabits();
            set({ todayHabits, isLoading: false });
            return todayHabits;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Erreur lors de la récupération des habitudes du jour',
            });
            throw error;
          }
        },

        // Récupérer les statistiques
        fetchHabitStats: async () => {
          try {
            set({ isLoading: true, error: null });
            const habitStats = await habitService.getHabitStats();
            set({ habitStats, isLoading: false });
            return habitStats;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Erreur lors de la récupération des statistiques',
            });
            throw error;
          }
        },

        // Actions pour les notifications
        fetchNotifications: async () => {
          try {
            set({ isLoading: true, error: null });
            const notifications = await habitService.getNotifications();
            set({ notifications, isLoading: false });
            return notifications;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Erreur lors de la récupération des notifications',
            });
            throw error;
          }
        },

        createNotification: async (notification: Partial<Notification>) => {
          try {
            set({ isLoading: true, error: null });
            const newNotification = await habitService.createNotification(notification);

            // Mettre à jour la liste des notifications
            set((state) => ({
              notifications: [...state.notifications, newNotification],
              isLoading: false,
            }));

            return newNotification;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Erreur lors de la création de la notification',
            });
            throw error;
          }
        },

        updateNotification: async (id: number, notification: Partial<Notification>) => {
          try {
            set({ isLoading: true, error: null });
            const updatedNotification = await habitService.updateNotification(id, notification);

            // Mettre à jour la liste des notifications
            set((state) => ({
              notifications: state.notifications.map((n) =>
                n.id === id ? updatedNotification : n
              ),
              isLoading: false,
            }));

            return updatedNotification;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Erreur lors de la mise à jour de la notification',
            });
            throw error;
          }
        },

        deleteNotification: async (id: number) => {
          try {
            set({ isLoading: true, error: null });
            await habitService.deleteNotification(id);

            // Mettre à jour la liste des notifications
            set((state) => ({
              notifications: state.notifications.filter((n) => n.id !== id),
              isLoading: false,
            }));
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Erreur lors de la suppression de la notification',
            });
            throw error;
          }
        },

        // Helpers
        clearError: () => set({ error: null }),
        setSelectedHabit: (habit: HabitDetailResponse | null) => set({ selectedHabit: habit }),
      }),
      {
        name: 'habit-storage',
        // Stocker uniquement certaines propriétés dans le localStorage
        partialize: (state) => ({
          categories: state.categories,
          habits: state.habits,
          todayHabits: state.todayHabits,
          // Ne pas persister les propriétés suivantes
          // selectedHabit: null,
          // isLoading: false,
          // error: null,
        }),
      }
    ),
    { name: 'habit-store' } // Nom pour les devtools
  )
);

export default useHabitStore;
