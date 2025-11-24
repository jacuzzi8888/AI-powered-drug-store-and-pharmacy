/**
 * Notification Context Provider
 * Manages toast notifications
 */

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Notification } from '../types';
import { UI_CONFIG } from '../utils/constants';

export interface NotificationContextValue {
    notifications: Notification[];
    addNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
    removeNotification: (id: number) => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    /**
     * Adds a new notification
     */
    const addNotification = useCallback((
        message: string,
        type: 'success' | 'info' | 'error' = 'info'
    ) => {
        const id = Date.now();
        const newNotification: Notification = { id, message, type };

        setNotifications(prev => {
            // Limit to max notifications
            const updated = [...prev, newNotification];
            if (updated.length > UI_CONFIG.MAX_NOTIFICATIONS) {
                return updated.slice(-UI_CONFIG.MAX_NOTIFICATIONS);
            }
            return updated;
        });

        // Auto-remove after duration
        setTimeout(() => {
            removeNotification(id);
        }, UI_CONFIG.NOTIFICATION_DURATION);
    }, []);

    /**
     * Removes a notification by ID
     */
    const removeNotification = useCallback((id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    /**
     * Clears all notifications
     */
    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const value: NotificationContextValue = {
        notifications,
        addNotification,
        removeNotification,
        clearAll
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

/**
 * Hook to use notification context
 */
export function useNotificationContext() {
    const context = React.useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }
    return context;
}
