/**
 * Login Page Wrapper
 * Connects Auth component to authentication context
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '../components/Auth';
import { useAuth, useNotifications } from '../hooks';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const { addNotification } = useNotifications();

    const handleLogin = useCallback(async (email: string, password: string) => {
        const result = await login(email, password);

        if (result.success) {
            addNotification(result.message, 'success');
            navigate('/products');
        } else {
            addNotification(result.message, 'error');
        }
    }, [login, addNotification, navigate]);

    const handleRegister = useCallback(async (email: string, password: string) => {
        const result = await register(email, password);

        if (result.success) {
            addNotification(result.message, 'success');
            // Auto-login after registration
            await handleLogin(email, password);
        } else {
            addNotification(result.message, 'error');
        }
    }, [register, addNotification, handleLogin]);

    return <Auth onLogin={handleLogin} onRegister={handleRegister} />;
}
