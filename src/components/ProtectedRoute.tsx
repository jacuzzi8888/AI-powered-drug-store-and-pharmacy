/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { user, loading, isAdmin } = useAuth();

    // Show nothing while loading (or you could show a loading spinner)
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-teal border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to dashboard if admin access required but user is not admin
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}
