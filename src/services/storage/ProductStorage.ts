/**
 * Product-specific storage operations
 */

import { storage } from './StorageService';
import { STORAGE_KEYS } from '../../utils/constants';
import type { Product } from '../../types';

/**
 * Default products that ship with the application
 */
const DEFAULT_PRODUCTS: Product[] = [
    {
        id: 'prod-001',
        name: 'Ibuprofen 200mg Tablets',
        description: 'Provides powerful relief from various types of pain including headaches, dental pain, and menstrual cramps. Also effective in reducing inflammation and fever. Contains 24 easy-to-swallow tablets.',
        price: 7500,
        imageUrl: 'https://picsum.photos/seed/ibuprofen/400/400',
        category: 'Pain Relief',
        stock: 100,
        isRecommended: true,
    },
    {
        id: 'prod-002',
        name: 'Allergy Relief Antihistamine',
        description: 'Offers 24-hour non-drowsy relief from common allergy symptoms such as sneezing, runny nose, itchy eyes, and hives. One tablet a day keeps your allergies at bay. 30 tablets per pack.',
        price: 18500,
        imageUrl: 'https://picsum.photos/seed/allergy/400/400',
        category: 'Allergy & Hay Fever',
        stock: 75,
    },
    {
        id: 'prod-003',
        name: 'Vitamin C 1000mg Effervescent',
        description: 'Boost your immune system with these high-strength Vitamin C tablets. The effervescent formula makes for a refreshing, easy-to-take orange-flavored drink. Contains 20 tablets.',
        price: 11000,
        imageUrl: 'https://picsum.photos/seed/vitaminc/400/400',
        category: 'Vitamins & Supplements',
        stock: 50,
        isRecommended: true,
    },
    {
        id: 'prod-004',
        name: 'Digital Thermometer',
        description: 'Get fast, accurate, and reliable temperature readings in seconds. Suitable for oral, rectal, or underarm use. Features a flexible tip and a clear digital display. Essential for every home first aid kit.',
        price: 15000,
        imageUrl: 'https://picsum.photos/seed/thermo/400/400',
        category: 'Health & Diagnostics',
        stock: 30,
    },
    {
        id: 'prod-005',
        name: 'Hydrocolloid Blemish Patches',
        description: 'A gentle yet effective solution for acne. These patches absorb impurities, reduce inflammation, and create a protective barrier to speed up healing. 72 invisible patches in various sizes.',
        price: 12500,
        imageUrl: 'https://picsum.photos/seed/acne/400/400',
        category: 'Skincare',
        stock: 0,
    },
    {
        id: 'prod-006',
        name: 'Soothing Throat Lozenges',
        description: 'Provides fast-acting relief for sore, scratchy throats. The honey and lemon flavor is both comforting and effective. Each pack contains 36 individually wrapped lozenges.',
        price: 6000,
        imageUrl: 'https://picsum.photos/seed/cough/400/400',
        category: 'Cold & Flu',
        stock: 120,
        isRecommended: true,
    },
];

/**
 * Retrieves all products from storage
 */
export function getAllProducts(): Product[] {
    const products = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);

    // If no products exist, initialize with defaults
    if (products.length === 0) {
        saveAllProducts(DEFAULT_PRODUCTS);
        return DEFAULT_PRODUCTS;
    }

    return products;
}

/**
 * Saves all products to storage
 */
export function saveAllProducts(products: Product[]): boolean {
    return storage.set(STORAGE_KEYS.PRODUCTS, products);
}

/**
 * Gets a single product by ID
 */
export function getProductById(id: string): Product | null {
    const products = getAllProducts();
    return products.find(p => p.id === id) || null;
}

/**
 * Adds a new product
 */
export function addProduct(product: Omit<Product, 'id'>): Product {
    const products = getAllProducts();

    const newProduct: Product = {
        ...product,
        id: `prod-${Date.now()}`,
        price: parseFloat(String(product.price)),
        stock: Number(product.stock),
    };

    products.unshift(newProduct);
    saveAllProducts(products);

    return newProduct;
}

/**
 * Updates an existing product
 */
export function updateProduct(id: string, updates: Partial<Product>): boolean {
    const products = getAllProducts();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        console.error(`Product ${id} not found`);
        return false;
    }

    products[index] = {
        ...products[index],
        ...updates,
        // Prevent changing the ID
        id: products[index].id,
    };

    return saveAllProducts(products);
}

/**
 * Removes a product
 */
export function removeProduct(id: string): boolean {
    const products = getAllProducts();
    const filtered = products.filter(p => p.id !== id);

    if (filtered.length === products.length) {
        console.warn(`Product ${id} not found`);
        return false;
    }

    return saveAllProducts(filtered);
}

/**
 * Updates product stock
 */
export function updateProductStock(id: string, newStock: number): boolean {
    return updateProduct(id, { stock: newStock });
}

/**
 * Decreases product stock (for orders)
 */
export function decreaseProductStock(id: string, quantity: number): boolean {
    const product = getProductById(id);

    if (!product) {
        console.error(`Product ${id} not found`);
        return false;
    }

    if (product.stock < quantity) {
        console.error(`Insufficient stock for product ${id}`);
        return false;
    }

    return updateProductStock(id, product.stock - quantity);
}

/**
 * Gets products by category
 */
export function getProductsByCategory(category: string): Product[] {
    const products = getAllProducts();
    return products.filter(p => p.category === category);
}

/**
 * Gets recommended products
 */
export function getRecommendedProducts(): Product[] {
    const products = getAllProducts();
    return products.filter(p => p.isRecommended);
}

/**
 * Gets in-stock products
 */
export function getInStockProducts(): Product[] {
    const products = getAllProducts();
    return products.filter(p => p.stock > 0);
}

/**
 * Searches products by name or description
 */
export function searchProducts(query: string): Product[] {
    if (!query || query.trim().length === 0) {
        return getAllProducts();
    }

    const products = getAllProducts();
    const lowerQuery = query.toLowerCase();

    return products.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Gets all unique categories
 */
export function getAllCategories(): string[] {
    const products = getAllProducts();
    const categories = new Set(products.map(p => p.category));
    return Array.from(categories).sort();
}

/**
 * Resets products to defaults
 */
export function resetToDefaultProducts(): boolean {
    return saveAllProducts(DEFAULT_PRODUCTS);
}
