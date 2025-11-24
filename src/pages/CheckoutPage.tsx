/**
 * Checkout Page Wrapper
 * Connects Checkout component to cart and order contexts
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Checkout from '../components/Checkout';
import { useCart, useOrders, useNotifications } from '../hooks';
import { ShippingAddress } from '../types';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, clearCart } = useCart();
    const { placeOrder } = useOrders();
    const { addNotification } = useNotifications();

    const handlePlaceOrder = useCallback((
        shippingAddress: ShippingAddress,
        paymentMethod: string
    ) => {
        if (items.length === 0) {
            addNotification('Your cart is empty', 'error');
            navigate('/products');
            return;
        }

        const order = placeOrder(items, shippingAddress, paymentMethod);

        if (order) {
            clearCart();
            addNotification('Order placed successfully!', 'success');
            navigate('/order-confirmation', { state: { orderId: order.id } });
        } else {
            addNotification('Failed to place order. Please try again.', 'error');
        }
    }, [items, placeOrder, clearCart, addNotification, navigate]);

    const handleCancel = useCallback(() => {
        navigate('/products');
    }, [navigate]);

    return (
        <Checkout
            cartItems={items}
            onPlaceOrder={handlePlaceOrder}
            setView={handleCancel}
        />
    );
}
