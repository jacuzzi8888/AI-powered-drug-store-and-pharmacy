/**
 * Input validation and sanitization utilities
 */

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

/**
 * Sanitizes email input by trimming and converting to lowercase
 */
export function sanitizeEmail(email: string): string {
    if (!email) return '';
    return email.trim().toLowerCase();
}

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    const sanitized = sanitizeEmail(email);

    if (!sanitized) {
        errors.push('Email is required');
        return { isValid: false, errors };
    }

    // RFC 5322 simplified pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(sanitized)) {
        errors.push('Please enter a valid email address');
    }

    if (sanitized.length > 254) {
        errors.push('Email is too long');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Sanitizes text input by removing potentially dangerous characters
 * and trimming whitespace
 */
export function sanitizeText(text: string): string {
    if (!text) return '';

    return text
        .trim()
        // Remove null bytes
        .replace(/\0/g, '')
        // Remove most HTML tags (basic XSS prevention)
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): ValidationResult {
    const errors: string[] = [];

    if (!password) {
        errors.push('Password is required');
        return { isValid: false, errors };
    }

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (password.length > 128) {
        errors.push('Password is too long (max 128 characters)');
    }

    // Check for at least one letter
    if (!/[a-zA-Z]/.test(password)) {
        errors.push('Password must contain at least one letter');
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validates a phone number (basic validation)
 */
export function validatePhone(phone: string): ValidationResult {
    const errors: string[] = [];
    const sanitized = phone.trim();

    if (!sanitized) {
        errors.push('Phone number is required');
        return { isValid: false, errors };
    }

    // Remove common formatting characters
    const digitsOnly = sanitized.replace(/[\s\-\(\)\.]/g, '');

    // Check if it contains only digits and optional + prefix
    if (!/^\+?\d+$/.test(digitsOnly)) {
        errors.push('Phone number can only contain digits and optional + prefix');
    }

    // Check length (between 10 and 15 digits)
    const digitCount = digitsOnly.replace('+', '').length;
    if (digitCount < 10 || digitCount > 15) {
        errors.push('Phone number must be between 10 and 15 digits');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Sanitizes a number input
 */
export function sanitizeNumber(value: string | number): number {
    if (typeof value === 'number') {
        return isNaN(value) ? 0 : value;
    }

    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
}

/**
 * Validates a price (must be positive)
 */
export function validatePrice(price: number): ValidationResult {
    const errors: string[] = [];

    if (isNaN(price)) {
        errors.push('Price must be a valid number');
    } else if (price < 0) {
        errors.push('Price cannot be negative');
    } else if (price > 10000000) {
        errors.push('Price is unreasonably high');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validates stock quantity
 */
export function validateStock(stock: number): ValidationResult {
    const errors: string[] = [];

    if (isNaN(stock)) {
        errors.push('Stock must be a valid number');
    } else if (stock < 0) {
        errors.push('Stock cannot be negative');
    } else if (!Number.isInteger(stock)) {
        errors.push('Stock must be a whole number');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validates a URL
 */
export function validateUrl(url: string): ValidationResult {
    const errors: string[] = [];

    if (!url) {
        errors.push('URL is required');
        return { isValid: false, errors };
    }

    try {
        new URL(url);
    } catch {
        errors.push('Please enter a valid URL');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
