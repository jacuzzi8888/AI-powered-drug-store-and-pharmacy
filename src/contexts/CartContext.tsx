/**
 * Shopping Cart Context Provider
 * Manages cart state and operations
 */

import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { getProductById, decreaseProductStock } from '../services/storage/ProductStorage';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';

export interface CartContextValue {
    items: CartItem[];
    itemCount: number;
    subtotal: number;
    addToCart: (product: Product, quantity?: number) => { success: boolean; message: string };
    updateQuantity: (productId: string, quantity: number) => { success: boolean; message: string };
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    isInCart: (productId: string) => boolean;
    getCartItem: (productId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Calculate item count
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    // Calculate subtotal
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    /**
     * Adds a product to the cart
     */
    const addToCart = useCallback((product: Product, quantity: number = 1): { success: boolean; message: string } => {
        // Validate stock
        const currentProduct = getProductById(product.id);
        if (!currentProduct || currentProduct.stock < quantity) {
            return { success: false, message: ERROR_MESSAGES.OUT_OF_STOCK };
        }

        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                // Check if new quantity exceeds stock
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > currentProduct.stock) {
                    return prevItems; // Will be handled by error message above
                }

                // Update quantity
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            }

            // Add new item
            return [...prevItems, { ...product, quantity }];
        });

        return { success: true, message: SUCCESS_MESSAGES.ITEM_ADDED };
    }, []);

    /**
     * Updates the quantity of an item in the cart
     */
    const updateQuantity = useCallback((productId: string, quantity: number): { success: boolean; message: string } => {
        if (quantity < 0) {
            return { success: false, message: 'Quantity cannot be negative' };
        }

        if (quantity === 0) {
            removeFromCart(productId);
            return { success: true, message: 'Item removed from cart' };
        }

        // Validate stock
        const currentProduct = getProductById(productId);
        if (!currentProduct || currentProduct.stock < quantity) {
            return {
                success: false,
                message: currentProduct
                    ? `Only ${currentProduct.stock} items available`
                    : ERROR_MESSAGES.OUT_OF_STOCK
            };
        }

        setItems(prevItems =>
            prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );

        return { success: true, message: 'Quantity updated' };
    }, []);

    /**
     * Removes an item from the cart
     */
    const removeFromCart = useCallback((productId: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== productId));
    }, []);

    /**
     * Clears all items from the cart
     */
    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    /**
     * Checks if a product is in the cart
     */
    const isInCart = useCallback((productId: string): boolean => {
        return items.some(item => item.id === productId);
    }, [items]);

    /**
     * Gets a cart item by product ID
     */
    const getCartItem = useCallback((productId: string): CartItem | undefined => {
        return items.find(item => item.id === productId);
    }, [items]);

    const value: CartContextValue = {
        items,
        itemCount,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isInCart,
        getCartItem
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook to use cart context
 */
export function useCartContext() {
    const context = React.useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
}
