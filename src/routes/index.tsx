/**
 * Route Configuration  
 * Defines all application routes
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Layout
import Layout from '../components/layout/Layout';

// Pages
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderHistoryPage from '../pages/OrderHistoryPage';
import OrderConfirmationPage from '../pages/OrderConfirmationPage';
import PrescriptionsPage from '../pages/PrescriptionsPage';
import AiAssistantPage from '../pages/AiAssistantPage';
import PharmacistMessagingPage from '../pages/PharmacistMessagingPage';
import HealthHubPage from '../pages/HealthHubPage';
import MyAccountPage from '../pages/MyAccountPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import InventoryManagerPage from '../pages/InventoryManagerPage';

/**
 * Router configuration with all routes
 */
export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
        errorElement: <ErrorBoundary />,
    },
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <Navigate to="/products" replace />,
            },
            {
                path: 'products',
                element: <ProductsPage />,
            },
            {
                path: 'health-hub',
                element: <HealthHubPage />,
            },
            {
                path: 'ai-assistant',
                element: <AiAssistantPage />,
            },
            // Protected User Routes
            {
                path: 'checkout',
                element: (
                    <ProtectedRoute>
                        <CheckoutPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'order-confirmation',
                element: (
                    <ProtectedRoute>
                        <OrderConfirmationPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'order-history',
                element: (
                    <ProtectedRoute>
                        <OrderHistoryPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'prescriptions',
                element: (
                    <ProtectedRoute>
                        <PrescriptionsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'pharmacist-messaging',
                element: (
                    <ProtectedRoute>
                        <PharmacistMessagingPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'my-account',
                element: (
                    <ProtectedRoute>
                        <MyAccountPage />
                    </ProtectedRoute>
                ),
            },
            // Admin Routes
            {
                path: 'admin',
                children: [
                    {
                        path: 'dashboard',
                        element: (
                            <ProtectedRoute requireAdmin>
                                <AdminDashboardPage />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: 'inventory',
                        element: (
                            <ProtectedRoute requireAdmin>
                                <InventoryManagerPage />
                            </ProtectedRoute>
                        ),
                    },
                ],
            },
            {
                path: '*',
                element: <Navigate to="/products" replace />,
            },
        ],
    },
]);
