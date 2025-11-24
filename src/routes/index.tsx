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

/**
 * Router configuration with all routes
 * Core user flow: Login → Products → Cart → Checkout → Order History
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
                path: '*',
                element: <Navigate to="/products" replace />,
            },
        ],
    },
]);
