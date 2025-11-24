/**
 * User-specific storage operations
 */

import { storage } from './StorageService';
import { STORAGE_KEYS } from '../../utils/constants';
import type { User } from '../../types';

/**
 * User credentials for authentication (stored separately from full user data)
 */
export interface UserCredentials {
    email: string;
    passwordHash: string;
    role: 'user' | 'admin';
}

/**
 * Retrieves all registered users' credentials
 */
export function getAllUserCredentials(): UserCredentials[] {
    return storage.get<UserCredentials[]>(STORAGE_KEYS.USERS, []);
}

/**
 * Saves user credentials (for registration/login)
 */
export function saveUserCredentials(credentials: UserCredentials): boolean {
    const allUsers = getAllUserCredentials();

    // Check if user already exists
    const existingIndex = allUsers.findIndex(u => u.email === credentials.email);

    if (existingIndex >= 0) {
        // Update existing user
        allUsers[existingIndex] = credentials;
    } else {
        // Add new user
        allUsers.push(credentials);
    }

    return storage.set(STORAGE_KEYS.USERS, allUsers);
}

/**
 * Gets user credentials by email
 */
export function getUserCredentials(email: string): UserCredentials | null {
    const allUsers = getAllUserCredentials();
    return allUsers.find(u => u.email === email) || null;
}

/**
 * Deletes user credentials
 */
export function deleteUserCredentials(email: string): boolean {
    const allUsers = getAllUserCredentials();
    const filtered = allUsers.filter(u => u.email !== email);
    return storage.set(STORAGE_KEYS.USERS, filtered);
}

/**
 * Generates a user-specific storage key
 */
function getUserKey(email: string): string {
    return `user_${email}`;
}

/**
 * Retrieves full user data (profile, addresses, etc.)
 */
export function getUserData(email: string): User | null {
    const key = getUserKey(email);
    const userData = storage.get<User | null>(key, null);

    if (!userData) {
        return null;
    }

    // Validate that the data has required fields
    if (!userData.email || !userData.role) {
        console.warn(`Invalid user data for ${email}`);
        return null;
    }

    return userData;
}

/**
 * Saves full user data
 */
export function saveUserData(user: User): boolean {
    const key = getUserKey(user.email);
    return storage.set(key, user);
}

/**
 * Deletes user data
 */
export function deleteUserData(email: string): void {
    const key = getUserKey(email);
    storage.remove(key);
}

/**
 * Gets the currently logged-in user's email
 */
export function getCurrentUserEmail(): string | null {
    return storage.get<string | null>(STORAGE_KEYS.CURRENT_USER_EMAIL, null);
}

/**
 * Sets the currently logged-in user's email
 */
export function setCurrentUserEmail(email: string): boolean {
    return storage.set(STORAGE_KEYS.CURRENT_USER_EMAIL, email);
}

/**
 * Clears the current user session
 */
export function clearCurrentUserSession(): void {
    storage.remove(STORAGE_KEYS.CURRENT_USER_EMAIL);
}

/**
 * Gets the currently logged-in user's full data
 */
export function getCurrentUser(): User | null {
    const email = getCurrentUserEmail();
    if (!email) {
        return null;
    }
    return getUserData(email);
}

/**
 * Checks if a user with the given email exists
 */
export function userExists(email: string): boolean {
    return getUserCredentials(email) !== null;
}

/**
 * Updates user profile data
 */
export function updateUserProfile(
    email: string,
    updates: Partial<User>
): boolean {
    const userData = getUserData(email);

    if (!userData) {
        console.error(`Cannot update: user ${email} not found`);
        return false;
    }

    const updatedUser: User = {
        ...userData,
        ...updates,
        // Prevent changing email or role through this method
        email: userData.email,
        role: userData.role,
    };

    return saveUserData(updatedUser);
}
