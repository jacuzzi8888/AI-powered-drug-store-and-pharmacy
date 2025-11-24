/**
 * Main Application Component
 * Provides context providers and routing
 * 
 * BEFORE: 467 lines with all business logic
 * AFTER: ~60 lines with just provider setup and routing
 */

import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { router } from './routes';

function App() {
    return (
        <ErrorBoundary>
            <NotificationProvider>
                <AuthProvider>
                    <ProductProvider>
                        <CartProvider>
                            <RouterProvider router={router} />
                        </CartProvider>
                    </ProductProvider>
                </AuthProvider>
            </NotificationProvider>
        </ErrorBoundary>
    );
}

export default App;
