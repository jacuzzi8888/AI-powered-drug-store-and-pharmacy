/**
 * Order History Page Wrapper
 * Connects OrderHistory component to orders context
 */

import React from 'react';
import OrderHistory from '../components/OrderHistory';
import { useOrders } from '../hooks';

export default function OrderHistoryPage() {
    const { orders } = useOrders();

    return <OrderHistory orders={orders} />;
}
