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
    console.log('[Layout] Component rendering...');
    const [isCartOpen, setCartOpen] = useState(false);
    console.log('[Layout] Calling useCart...');
    const { items, itemCount, updateQuantity, removeFromCart } = useCart();
    console.log('[Layout] Calling useAuth...');
    const { user, logout } = useAuth();
    console.log('[Layout] Calling useNotifications...');
    const { notifications, removeNotification } = useNotifications();

    console.log('[Layout] Rendering layout with user:', user?.email, 'cart items:', itemCount);
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
