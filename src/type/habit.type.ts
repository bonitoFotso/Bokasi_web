// Types for Category
export interface Category {
    id: number;
    name: string;
    color: string;
    userId: number;
    createdAt: string;
}

// Possible frequency values for Habit
export type FrequencyType = 'daily' | 'weekly' | 'custom';

// Types for Habit
export interface Habit {
  id: number;
  name: string;
  description: string | null;
  frequency: FrequencyType;

  // For custom frequency (specific days)
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;

  // Category reference
  categoryId: number | null;
  category?: Category;

  // User reference
  userId: number;

  // Dates
  createdAt: string;
  start_date: string;

  // Computed properties (can be added when needed)
  streak?: number;
  shouldCompleteToday?: boolean;

  completions?: HabitCompletion[];
  notifications?: Notification[];
  calendar?: CalendarEntry[];
}

// Time preference for notifications
export type TimePreference = 'morning' | 'afternoon' | 'evening' | 'custom';

// Types for Notification
export interface Notification {
    id: number;
    habitId: number;
    habit?: Habit;
    timePreference: TimePreference;
    customTime: string | null;
    isActive: boolean;
}

// Types for HabitCompletion
export interface HabitCompletion {
  id: number;
  habitId: number;
  habit?: Habit;
  date: string;
  completed_at: string | null;
  notes: string | null;
}

// API Response Types

// User API Response
export interface UserResponse {
    id: number;
    username: string;
    email: string;
}

// Calendar Entry Response
export interface CalendarEntry {
    date: string;
    completed: boolean;
    shouldComplete: boolean;
}

// Habit Statistics Response
export interface HabitStats {
    totalHabits: number;
    categoryStats: {
        id: number;
        name: string;
        color: string;
        count: number;
    }[];
    completionStats: {
        date: string;
        completions: number;
        shouldComplete: number;
        completionRate: number;
    }[];
    streaks: {
        bestStreak: number;
        totalCompletions: number;
    };
}

// API Response Interfaces
export type CategoryResponse = Category

export interface HabitResponse extends Habit {
    categoryName?: string;
    completions?: HabitCompletion[];
    notifications?: Notification[];
}

export interface HabitDetailResponse extends HabitResponse {
    calendar: CalendarEntry[];
}

export type NotificationResponse = Notification

export type HabitCompletionResponse = HabitCompletion