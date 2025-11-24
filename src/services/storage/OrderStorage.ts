/**
 * Order-specific storage operations
 */

import { storage } from './StorageService';
import { STORAGE_KEYS } from '../../utils/constants';
import type { Order } from '../../types';

/**
 * Retrieves all orders from storage
 */
export function getAllOrders(): Order[] {
    const orders = storage.get<any[]>(STORAGE_KEYS.ORDER_HISTORY, []);

    // Rehydrate Date objects
    return orders.map(order => ({
        ...order,
        date: new Date(order.date),
    }));
}

/**
 * Saves all orders to storage
 */
export function saveAllOrders(orders: Order[]): boolean {
    return storage.set(STORAGE_KEYS.ORDER_HISTORY, orders);
}

/**
 * Gets a single order by ID
 */
export function getOrderById(id: string): Order | null {
    const orders = getAllOrders();
    return orders.find(o => o.id === id) || null;
}

/**
 * Adds a new order
 */
export function addOrder(order: Order): boolean {
    const orders = getAllOrders();
    orders.unshift(order); // Add to beginning
    return saveAllOrders(orders);
}

/**
 * Updates an existing order
 */
export function updateOrder(id: string, updates: Partial<Order>): boolean {
    const orders = getAllOrders();
    const index = orders.findIndex(o => o.id === id);

    if (index === -1) {
        console.error(`Order ${id} not found`);
        return false;
    }

    orders[index] = {
        ...orders[index],
        ...updates,
        // Prevent changing the ID and date
        id: orders[index].id,
        date: orders[index].date,
    };

    return saveAllOrders(orders);
}

/**
 * Gets orders for a specific user
 */
export function getUserOrders(userEmail: string): Order[] {
    // For now, we return all orders
    // In a real app, orders would have a userId field
    return getAllOrders();
}

/**
 * Gets recent orders (last N orders)
 */
export function getRecentOrders(count: number = 10): Order[] {
    const orders = getAllOrders();
    return orders.slice(0, count);
}

/**
 * Deletes an order
 */
export function deleteOrder(id: string): boolean {
    const orders = getAllOrders();
    const filtered = orders.filter(o => o.id !== id);

    if (filtered.length === orders.length) {
        console.warn(`Order ${id} not found`);
        return false;
    }

    return saveAllOrders(filtered);
}

/**
 * Clears all orders
 */
export function clearAllOrders(): boolean {
    return storage.set(STORAGE_KEYS.ORDER_HISTORY, []);
}
