/**
 * Inventory Manager Page Wrapper
 * Connects InventoryManager to products context
 */

import React from 'react';
import InventoryManager from '../components/InventoryManager';
import { useProducts, useNotifications } from '../hooks';
import { Product } from '../types';

export default function InventoryManagerPage() {
    const { products, addProduct, removeProduct } = useProducts();
    const { addNotification } = useNotifications();

    const handleAddProduct = (product: Omit<Product, 'id'>) => {
        addProduct(product);
        addNotification('Product added successfully', 'success');
    };

    const handleRemoveProduct = (productId: string) => {
        removeProduct(productId);
        addNotification('Product removed successfully', 'success');
    };

    return (
        <InventoryManager
            products={products}
            onAddProduct={handleAddProduct}
            onRemoveProduct={handleRemoveProduct}
        />
    );
}
