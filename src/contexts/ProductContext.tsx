/**
 * Product Context Provider
 * Manages product catalog state
 */

import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import {
    getAllProducts,
    addProduct as addProductToStorage,
    updateProduct as updateProductInStorage,
    removeProduct as removeProductFromStorage,
    getProductById,
    getRecommendedProducts as getRecommendedFromStorage,
    getProductsByCategory as getProductsByCategoryFromStorage,
    getAllCategories as getCategoriesFromStorage
} from '../services/storage/ProductStorage';

export interface ProductContextValue {
    products: Product[];
    loading: boolean;
    addProduct: (product: Omit<Product, 'id'>) => Product;
    updateProduct: (id: string, updates: Partial<Product>) => boolean;
    removeProduct: (id: string) => boolean;
    getProduct: (id: string) => Product | null;
    getRecommendedProducts: () => Product[];
    getProductsByCategory: (category: string) => Product[];
    getCategories: () => string[];
    refreshProducts: () => void;
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

interface ProductProviderProps {
    children: ReactNode;
}

export function ProductProvider({ children }: ProductProviderProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Load products on mount
    useEffect(() => {
        refreshProducts();
    }, []);

    /**
     * Refreshes products from storage
     */
    const refreshProducts = useCallback(() => {
        setLoading(true);
        try {
            const loadedProducts = getAllProducts();
            setProducts(loadedProducts);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Adds a new product
     */
    const addProduct = useCallback((productData: Omit<Product, 'id'>): Product => {
        const newProduct = addProductToStorage(productData);
        setProducts(prev => [newProduct, ...prev]);
        return newProduct;
    }, []);

    /**
     * Updates an existing product
     */
    const updateProduct = useCallback((id: string, updates: Partial<Product>): boolean => {
        const success = updateProductInStorage(id, updates);
        if (success) {
            setProducts(prev =>
                prev.map(p => (p.id === id ? { ...p, ...updates } : p))
            );
        }
        return success;
    }, []);

    /**
     * Removes a product
     */
    const removeProduct = useCallback((id: string): boolean => {
        const success = removeProductFromStorage(id);
        if (success) {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
        return success;
    }, []);

    /**
     * Gets a single product by ID
     */
    const getProduct = useCallback((id: string): Product | null => {
        return getProductById(id);
    }, []);

    /**
     * Gets recommended products
     */
    const getRecommendedProducts = useCallback((): Product[] => {
        return products.filter(p => p.isRecommended);
    }, [products]);

    /**
     * Gets products by category
     */
    const getProductsByCategory = useCallback((category: string): Product[] => {
        return products.filter(p => p.category === category);
    }, [products]);

    /**
     * Gets all categories
     */
    const getCategories = useCallback((): string[] => {
        const categories = new Set(products.map(p => p.category));
        return Array.from(categories).sort();
    }, [products]);

    const value: ProductContextValue = {
        products,
        loading,
        addProduct,
        updateProduct,
        removeProduct,
        getProduct,
        getRecommendedProducts,
        getProductsByCategory,
        getCategories,
        refreshProducts
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

/**
 * Hook to use product context
 */
export function useProductContext() {
    const context = React.useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
}
