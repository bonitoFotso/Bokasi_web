// User and UserProfile interfaces for TypeScript

/**
 * Interface representing a User
 */
export interface User {
    id?: number;
    username?: string;
    email: string;
    first_name?: string;
    last_name?: string;
    profile?: UserProfile;
}

/**
 * Interface representing a UserProfile with extended user information
 */
export interface UserProfile {
    dark_mode?: boolean;
    email_notifications?: boolean;
    push_notifications?: boolean;
    timezone?: string;
    language?: string;
    date_joined?: string;
    last_login_ip?: string | null;
    streak_record?: number;
    avatar?: string | null;
    bio?: string;
}

/**
 * Interface for user registration data
 */
export interface RegisterUserData {
    username?: string;
    email: string;
    password: string;
    password2: string;
    first_name?: string;
    last_name?: string;
}

/**
 * Interface for login credentials
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Interface for authentication responses
 */
export interface AuthResponse {
    user: User;
    access: string;
    refresh: string;
    message?: string;
}

/**
 * Interface for password change request
 */
export interface ChangePasswordData {
    old_password: string;
    new_password: string;
    new_password2: string;
}

/**
 * Interface for password reset request
 */
export interface PasswordResetData {
    email: string;
}

/**
 * Interface for setting a new password after reset
 */
export interface NewPasswordData {
    uid: string;
    token: string;
    new_password: string;
}

/**
 * Interface for email verification
 */
export interface EmailVerificationData {
    uid: string;
    token: string;
}