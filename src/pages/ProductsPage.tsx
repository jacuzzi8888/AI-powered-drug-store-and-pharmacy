/**
 * Products Page Wrapper
 * Connects Products component to context hooks
 */

import React, { useState, useCallback } from 'react';
import Products from '../components/Products';
import ProductDetailModal from '../components/ProductDetailModal';
import { Product } from '../types';
import { useProducts, useCart, useNotifications } from '../hooks';

export default function ProductsPage() {
    const { products } = useProducts();
    const { addToCart } = useCart();
    const { addNotification } = useNotifications();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleAddToCart = useCallback((product: Product, quantity: number) => {
        const result = addToCart(product, quantity);
        if (result.success) {
            addNotification(result.message, 'success');
        } else {
            addNotification(result.message, 'error');
        }
    }, [addToCart, addNotification]);

    const handleQuickView = useCallback((product: Product) => {
        setSelectedProduct(product);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedProduct(null);
    }, []);

    return (
        <>
            <Products
                products={products}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
            />
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={handleCloseModal}
                    onAddToCart={handleAddToCart}
                />
            )}
        </>
    );
}
