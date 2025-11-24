/**
 * Custom hook for order management
 */

import { useState, useCallback, useEffect } from 'react';
import { Order, OrderStatus, CartItem, ShippingAddress } from '../types';
import {
    getAllOrders,
    addOrder as addOrderToStorage,
    updateOrder as updateOrderInStorage,
    getOrderById,
    getRecentOrders
} from '../services/storage/OrderStorage';
import { decreaseProductStock } from '../services/storage/ProductStorage';
import { ORDER_CONFIG, ORDER_TRANSITIONS } from '../utils/constants';

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Load orders on mount
    useEffect(() => {
        refreshOrders();
    }, []);

    // Order status progression
    useEffect(() => {
        const interval = setInterval(() => {
            let ordersChanged = false;

            const updatedOrders = orders.map(order => {
                const secondsSinceOrder = (new Date().getTime() - new Date(order.date).getTime()) / 1000;

                if (order.status === OrderStatus.Processing && secondsSinceOrder * 1000 > ORDER_TRANSITIONS.PROCESSING_TO_PAID) {
                    ordersChanged = true;
                    return { ...order, status: OrderStatus.Paid };
                } else if (order.status === OrderStatus.Paid && secondsSinceOrder * 1000 > ORDER_TRANSITIONS.PAID_TO_SHIPPED) {
                    ordersChanged = true;
                    return {
                        ...order,
                        status: OrderStatus.Shipped,
                        trackingLink: `https://example-courier.com/track?id=${order.id}`
                    };
                } else if (order.status === OrderStatus.Shipped && secondsSinceOrder * 1000 > ORDER_TRANSITIONS.SHIPPED_TO_DELIVERED) {
                    ordersChanged = true;
                    return { ...order, status: OrderStatus.Delivered };
                }
                return order;
            });

            if (ordersChanged) {
                setOrders(updatedOrders);
                // Persist to storage
                updatedOrders.forEach(order => updateOrderInStorage(order.id, order));
            }
        }, ORDER_TRANSITIONS.STATUS_CHECK_INTERVAL);

        return () => clearInterval(interval);
    }, [orders]);

    /**
     * Refreshes orders from storage
     */
    const refreshOrders = useCallback(() => {
        setLoading(true);
        try {
            const loadedOrders = getAllOrders();
            setOrders(loadedOrders);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Places a new order
     */
    const placeOrder = useCallback((
        items: CartItem[],
        shippingAddress: ShippingAddress,
        paymentMethod: string
    ): Order | null => {
        if (items.length === 0) {
            console.error('Cannot place order with empty cart');
            return null;
        }

        // Decrease stock for each item
        for (const item of items) {
            const success = decreaseProductStock(item.id, item.quantity);
            if (!success) {
                console.error(`Failed to decrease stock for product ${item.id}`);
                // In production, you'd want to rollback previous stock changes
                return null;
            }
        }

        // Calculate totals
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shippingCost = subtotal >= ORDER_CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : ORDER_CONFIG.SHIPPING_COST;
        const total = subtotal + shippingCost;

        const newOrder: Order = {
            id: `order-${Date.now()}`,
            date: new Date(),
            items: [...items],
            total,
            shippingAddress,
            paymentMethod,
            status: OrderStatus.Processing
        };

        const success = addOrderToStorage(newOrder);
        if (success) {
            setOrders(prev => [newOrder, ...prev]);
            return newOrder;
        }

        return null;
    }, []);

    /**
     * Gets a specific order
     */
    const getOrder = useCallback((id: string): Order | null => {
        return getOrderById(id);
    }, []);

    /**
     * Gets recent orders
     */
    const getRecent = useCallback((count: number = 10): Order[] => {
        return orders.slice(0, count);
    }, [orders]);

    return {
        orders,
        loading,
        placeOrder,
        getOrder,
        getRecent,
        refreshOrders
    };
}
