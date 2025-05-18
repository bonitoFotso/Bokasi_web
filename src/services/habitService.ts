import type { Habit, Category, HabitStats, Notification, HabitCompletion } from 'src/type/habit.type';

import { apiClient } from './authApi';

const ENDPOINTS = {
  CATEGORIES: '/categories/',
  HABITS: '/habits/',
  HABITS_TODAY: '/habits/today/',
  HABITS_STATS: '/habits/stats/',
  NOTIFICATIONS: '/notifications/',
};

export const habitService = {
  // Categories
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get(ENDPOINTS.CATEGORIES);
    return response.data;
  },

  getCategory: async (id: number): Promise<Category> => {
    const response = await apiClient.get(`${ENDPOINTS.CATEGORIES}${id}/`);
    return response.data;
  },

  createCategory: async (category: Partial<Category>): Promise<Category> => {
    const response = await apiClient.post(ENDPOINTS.CATEGORIES, category);
    return response.data;
  },

  updateCategory: async (id: number, category: Partial<Category>): Promise<Category> => {
    const response = await apiClient.put(`${ENDPOINTS.CATEGORIES}${id}/`, category);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.CATEGORIES}${id}/`);
  },

  // Habits
  getHabits: async (params?: { category?: number; frequency?: string }): Promise<Habit[]> => {
    const response = await apiClient.get(ENDPOINTS.HABITS, { params });
    return response.data;
  },

  getHabit: async (id: number): Promise<Habit> => {
    const response = await apiClient.get(`${ENDPOINTS.HABITS}${id}/`);
    return response.data;
  },

  createHabit: async (habit: Partial<Habit>): Promise<Habit> => {
    console.log(habit);
    const response = await apiClient.post(ENDPOINTS.HABITS, habit);
    return response.data;
  },

  updateHabit: async (id: number, habit: Partial<Habit>): Promise<Habit> => {
    const response = await apiClient.put(`${ENDPOINTS.HABITS}${id}/`, habit);
    return response.data;
  },

  deleteHabit: async (id: number): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.HABITS}${id}/`);
  },

  completeHabit: async (
    id: number,
    data?: { date?: string; notes?: string }
  ): Promise<HabitCompletion> => {
    const response = await apiClient.post(`${ENDPOINTS.HABITS}${id}/complete/`, data || {});
    return response.data;
  },

  uncompleteHabit: async (id: number, data?: { date?: string }): Promise<void> => {
    await apiClient.post(`${ENDPOINTS.HABITS}${id}/uncomplete/`, data || {});
  },

  getTodayHabits: async (): Promise<Habit[]> => {
    const response = await apiClient.get(ENDPOINTS.HABITS_TODAY);
    return response.data;
  },

  getHabitStats: async (): Promise<HabitStats> => {
    const response = await apiClient.get(ENDPOINTS.HABITS_STATS);
    return response.data;
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get(ENDPOINTS.NOTIFICATIONS);
    return response.data;
  },

  createNotification: async (notification: Partial<Notification>): Promise<Notification> => {
    const response = await apiClient.post(ENDPOINTS.NOTIFICATIONS, notification);
    return response.data;
  },

  updateNotification: async (
    id: number,
    notification: Partial<Notification>
  ): Promise<Notification> => {
    const response = await apiClient.put(`${ENDPOINTS.NOTIFICATIONS}${id}/`, notification);
    return response.data;
  },

  deleteNotification: async (id: number): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.NOTIFICATIONS}${id}/`);
  },
};

export default habitService;
