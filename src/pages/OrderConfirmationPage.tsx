/**
 * Order Confirmation Page Wrapper
 * Shows confirmation after successful order
 */

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrderConfirmation from '../components/OrderConfirmation';
import { useOrders } from '../hooks';
import type { Order } from '../types';

export default function OrderConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { getOrder } = useOrders();
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        // Get order ID from navigation state or latest order
        const orderId = location.state?.orderId;

        if (orderId) {
            const foundOrder = getOrder(orderId);
            if (foundOrder) {
                setOrder(foundOrder);
            } else {
                navigate('/products');
            }
        } else {
            navigate('/products');
        }
    }, [location, getOrder, navigate]);

    const handleContinueShopping = () => {
        navigate('/products');
    };

    if (!order) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <OrderConfirmation
            order={order}
            setView={handleContinueShopping}
        />
    );
}
