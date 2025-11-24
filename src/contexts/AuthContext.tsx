/**
 * Authentication Context Provider
 * Manages user authentication state and operations
 */

import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User } from '../types';
import {
    getUserCredentials,
    saveUserCredentials,
    getUserData,
    saveUserData,
    getCurrentUserEmail,
    setCurrentUserEmail,
    clearCurrentUserSession,
    userExists,
    UserCredentials
} from '../services/storage/UserStorage';
import { hashPassword, verifyPassword, isHashedPassword } from '../utils/crypto';
import { validateEmail, validatePassword, sanitizeEmail } from '../utils/validation';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';

export interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    updateProfile: (updates: Partial<User>) => Promise<boolean>;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const email = getCurrentUserEmail();
                if (email) {
                    const userData = getUserData(email);
                    if (userData) {
                        setUser(userData);
                    } else {
                        // Session exists but user data doesn't - clear session
                        clearCurrentUserSession();
                    }
                }
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    /**
     * Migrates old plain-text passwords to hashed format
     * This is a one-time migration helper
     */
    const migrateOldPassword = async (email: string, plainPassword: string): Promise<boolean> => {
        try {
            const credentials = getUserCredentials(email);
            if (!credentials) return false;

            // If password is not hashed, hash it
            if (!isHashedPassword(credentials.passwordHash)) {
                const passwordHash = await hashPassword(plainPassword);
                saveUserCredentials({
                    ...credentials,
                    passwordHash
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Migration error:', error);
            return false;
        }
    };

    /**
     * Registers a new user
     */
    const register = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
        try {
            // Validate inputs
            const emailValidation = validateEmail(email);
            if (!emailValidation.isValid) {
                return { success: false, message: emailValidation.errors[0] };
            }

            const passwordValidation = validatePassword(password);
            if (!passwordValidation.isValid) {
                return { success: false, message: passwordValidation.errors[0] };
            }

            const sanitizedEmail = sanitizeEmail(email);

            // Check if user already exists
            if (userExists(sanitizedEmail)) {
                return { success: false, message: ERROR_MESSAGES.USER_EXISTS };
            }

            // Hash password
            const passwordHash = await hashPassword(password);

            // Determine role (first user is admin)
            const role: 'user' | 'admin' = getUserCredentials('') === null ? 'admin' : 'user';

            // Save credentials
            const credentials: UserCredentials = {
                email: sanitizedEmail,
                passwordHash,
                role
            };
            saveUserCredentials(credentials);

            // Create user profile
            const newUser: User = {
                email: sanitizedEmail,
                password: passwordHash, // For compatibility with existing User type
                role,
                profile: {
                    fullName: 'New User',
                    dateOfBirth: '',
                    phone: ''
                },
                addresses: [],
                paymentMethods: [],
                insurance: []
            };
            saveUserData(newUser);

            return {
                success: true,
                message: `${SUCCESS_MESSAGES.REGISTER_SUCCESS} ${role === 'admin' ? 'You are the admin!' : ''}`
            };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: ERROR_MESSAGES.GENERIC_ERROR };
        }
    }, []);

    /**
     * Logs in a user
     */
    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
        try {
            const sanitizedEmail = sanitizeEmail(email);
            const credentials = getUserCredentials(sanitizedEmail);

            if (!credentials) {
                return { success: false, message: ERROR_MESSAGES.INVALID_CREDENTIALS };
            }

            // Check if old plain-text password (migration)
            if (!isHashedPassword(credentials.passwordHash)) {
                // Try direct comparison (old way)
                if (credentials.passwordHash === password) {
                    // Migrate to hashed password
                    await migrateOldPassword(sanitizedEmail, password);
                } else {
                    return { success: false, message: ERROR_MESSAGES.INVALID_CREDENTIALS };
                }
            } else {
                // Verify hashed password
                const isValid = await verifyPassword(password, credentials.passwordHash);
                if (!isValid) {
                    return { success: false, message: ERROR_MESSAGES.INVALID_CREDENTIALS };
                }
            }

            // Load user data
            const userData = getUserData(sanitizedEmail);
            if (!userData) {
                return { success: false, message: ERROR_MESSAGES.GENERIC_ERROR };
            }

            // Set current user
            setUser(userData);
            setCurrentUserEmail(sanitizedEmail);

            return { success: true, message: SUCCESS_MESSAGES.LOGIN_SUCCESS };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: ERROR_MESSAGES.GENERIC_ERROR };
        }
    }, []);

    /**
     * Logs out the current user
     */
    const logout = useCallback(() => {
        setUser(null);
        clearCurrentUserSession();
    }, []);

    /**
     * Updates user profile
     */
    const updateProfile = useCallback(async (updates: Partial<User>): Promise<boolean> => {
        if (!user) {
            console.error('No user logged in');
            return false;
        }

        try {
            const updatedUser: User = {
                ...user,
                ...updates,
                // Prevent changing email and role
                email: user.email,
                role: user.role,
                password: user.password
            };

            const success = saveUserData(updatedUser);
            if (success) {
                setUser(updatedUser);
            }
            return success;
        } catch (error) {
            console.error('Profile update error:', error);
            return false;
        }
    }, [user]);

    const value: AuthContextValue = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: user !== null,
        isAdmin: user?.role === 'admin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuthContext() {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
