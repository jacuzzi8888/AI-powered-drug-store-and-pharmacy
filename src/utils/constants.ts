/**
 * Application-wide constants
 */

// Storage Keys
export const STORAGE_KEYS = {
    USERS: 'users',
    CURRENT_USER_EMAIL: 'currentUserEmail',
    PRODUCTS: 'products',
    ORDER_HISTORY: 'orderHistory',
    PRESCRIPTIONS: 'prescriptions',
    PHARMACIST_MESSAGES: 'pharmacistMessages',
    APP_VERSION: 'appVersion',
} as const;

// Route Paths
export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/products/:id',
    CART: '/cart',
    CHECKOUT: '/checkout',
    ORDER_CONFIRMATION: '/order-confirmation',
    ORDER_HISTORY: '/order-history',
    PRESCRIPTIONS: '/prescriptions',
    AI_ASSISTANT: '/ai-assistant',
    PHARMACIST_MESSAGING: '/pharmacist-messaging',
    HEALTH_HUB: '/health-hub',
    MY_ACCOUNT: '/my-account',
    LOGIN: '/login',
    REGISTER: '/register',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_INVENTORY: '/admin/inventory',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    EMAIL_MAX_LENGTH: 254,
    PHONE_MIN_LENGTH: 10,
    PHONE_MAX_LENGTH: 15,
    PRODUCT_NAME_MAX_LENGTH: 200,
    DESCRIPTION_MAX_LENGTH: 1000,
    MAX_PRICE: 10000000,
    MAX_STOCK: 999999,
} as const;

// Order Configuration
export const ORDER_CONFIG = {
    SHIPPING_COST: 2500, // ₦25.00
    TAX_RATE: 0.075, // 7.5%
    FREE_SHIPPING_THRESHOLD: 50000, // ₦500.00
    MIN_ORDER_AMOUNT: 500, // ₦5.00
} as const;

// Order Status Transition Times (in milliseconds)
export const ORDER_TRANSITIONS = {
    PROCESSING_TO_PAID: 5000, // 5 seconds
    PAID_TO_SHIPPED: 10000, // 10 seconds (from order creation)
    SHIPPED_TO_DELIVERED: 20000, // 20 seconds (from order creation)
    STATUS_CHECK_INTERVAL: 5000, // Check every 5 seconds
} as const;

// Prescription Configuration
export const PRESCRIPTION_CONFIG = {
    VERIFICATION_MIN_TIME: 5000, // 5 seconds
    VERIFICATION_MAX_TIME: 8000, // 8 seconds
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
} as const;

// UI Configuration
export const UI_CONFIG = {
    NOTIFICATION_DURATION: 5000, // 5 seconds
    DEBOUNCE_DELAY: 300, // 300ms
    MAX_NOTIFICATIONS: 3,
    ITEMS_PER_PAGE: 12,
} as const;

// Application Version
export const APP_VERSION = '2.0.0';

// Feature Flags (for gradual rollout)
export const FEATURE_FLAGS = {
    USE_NEW_AUTH: true,
    USE_CONTEXTS: true,
    USE_ROUTER: true,
    SHOW_MIGRATION_NOTICE: true,
} as const;

// Currency Configuration
export const CURRENCY = {
    CODE: 'NGN',
    SYMBOL: '₦',
    DECIMAL_PLACES: 2,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    STORAGE_ERROR: 'Unable to save data. Please check your browser settings.',
    AUTH_REQUIRED: 'Please log in to continue.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    USER_EXISTS: 'An account with this email already exists.',
    GENERIC_ERROR: 'Something went wrong. Please try again.',
    OUT_OF_STOCK: 'This item is currently out of stock.',
    CART_EMPTY: 'Your cart is empty.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Welcome back!',
    REGISTER_SUCCESS: 'Account created successfully! Please log in.',
    LOGOUT_SUCCESS: 'Logged out successfully.',
    PROFILE_UPDATED: 'Profile updated successfully.',
    ITEM_ADDED: 'Item added to cart.',
    ORDER_PLACED: 'Order placed successfully!',
    PRESCRIPTION_UPLOADED: 'Prescription uploaded successfully.',
} as const;
