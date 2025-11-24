/**
 * Main Layout Component
 * Wraps all pages with Header and Footer
 */

import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Cart from '../Cart';
import { useState } from 'react';
import { useCart, useAuth, useNotifications } from '../../hooks';
import NotificationContainer from '../ui/NotificationContainer';

export default function Layout() {
    const [isCartOpen, setCartOpen] = useState(false);
    const { items, itemCount, updateQuantity, removeFromCart } = useCart();
    const { user, logout } = useAuth();
    const { notifications, removeNotification } = useNotifications();

    return (
        <div className="min-h-screen flex flex-col bg-background-cream">
            <NotificationContainer
                notifications={notifications}
                removeNotification={removeNotification}
            />
            <Header
                cartItemCount={itemCount}
                onCartClick={() => setCartOpen(true)}
                user={user}
                onLogout={logout}
            />
            <Cart
                isOpen={isCartOpen}
                onClose={() => setCartOpen(false)}
                items={items}
                onUpdateQuantity={(productId, quantity) => updateQuantity(productId, quantity)}
                onRemove={removeFromCart}
                onCheckout={() => {
                    setCartOpen(false);
                }}
            />
            <main className="flex-1 w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
