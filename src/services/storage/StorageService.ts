/**
 * Type-safe localStorage wrapper with error handling
 */

const STORAGE_PREFIX = 'pharmacy_';
const STORAGE_VERSION_KEY = `${STORAGE_PREFIX}version`;
const CURRENT_VERSION = '2.0.0';

export interface StorageOptions {
    usePrefix?: boolean;
    throwOnError?: boolean;
}

/**
 * Main storage service class
 */
class StorageService {
    private prefix: string;
    private throwOnError: boolean;

    constructor(options: StorageOptions = {}) {
        this.prefix = options.usePrefix !== false ? STORAGE_PREFIX : '';
        this.throwOnError = options.throwOnError || false;
    }

    /**
     * Checks if localStorage is available
     */
    private isAvailable(): boolean {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Gets the prefixed key
     */
    private getKey(key: string): string {
        return `${this.prefix}${key}`;
    }

    /**
     * Retrieves an item from localStorage with type safety
     */
    get<T>(key: string, defaultValue: T): T {
        if (!this.isAvailable()) {
            console.warn('localStorage is not available');
            return defaultValue;
        }

        try {
            const item = localStorage.getItem(this.getKey(key));

            if (item === null) {
                return defaultValue;
            }

            return JSON.parse(item) as T;
        } catch (error) {
            console.error(`Error reading from localStorage (key: ${key}):`, error);

            if (this.throwOnError) {
                throw error;
            }

            return defaultValue;
        }
    }

    /**
     * Stores an item in localStorage
     */
    set<T>(key: string, value: T): boolean {
        if (!this.isAvailable()) {
            console.warn('localStorage is not available');
            return false;
        }

        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(this.getKey(key), serialized);
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage (key: ${key}):`, error);

            if (this.throwOnError) {
                throw error;
            }

            // Check if it's a quota exceeded error
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                console.error('localStorage quota exceeded');
            }

            return false;
        }
    }

    /**
     * Removes an item from localStorage
     */
    remove(key: string): void {
        if (!this.isAvailable()) {
            return;
        }

        try {
            localStorage.removeItem(this.getKey(key));
        } catch (error) {
            console.error(`Error removing from localStorage (key: ${key}):`, error);

            if (this.throwOnError) {
                throw error;
            }
        }
    }

    /**
     * Clears all items with the storage prefix
     */
    clear(): void {
        if (!this.isAvailable()) {
            return;
        }

        try {
            const keysToRemove: string[] = [];

            // Find all keys with our prefix
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    keysToRemove.push(key);
                }
            }

            // Remove them
            keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.error('Error clearing localStorage:', error);

            if (this.throwOnError) {
                throw error;
            }
        }
    }

    /**
     * Checks if a key exists
     */
    has(key: string): boolean {
        if (!this.isAvailable()) {
            return false;
        }

        return localStorage.getItem(this.getKey(key)) !== null;
    }

    /**
     * Gets all keys (without prefix)
     */
    keys(): string[] {
        if (!this.isAvailable()) {
            return [];
        }

        const keys: string[] = [];
        const prefixLength = this.prefix.length;

        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    keys.push(key.substring(prefixLength));
                }
            }
        } catch (error) {
            console.error('Error getting keys from localStorage:', error);
        }

        return keys;
    }

    /**
     * Gets the storage version
     */
    getVersion(): string | null {
        return localStorage.getItem(STORAGE_VERSION_KEY);
    }

    /**
     * Sets the storage version
     */
    setVersion(version: string): void {
        localStorage.setItem(STORAGE_VERSION_KEY, version);
    }

    /**
     * Checks if migration is needed
     */
    needsMigration(): boolean {
        const storedVersion = this.getVersion();
        return storedVersion !== CURRENT_VERSION;
    }

    /**
     * Migrates data from old format to new format
     */
    migrate(): void {
        const storedVersion = this.getVersion();

        if (!storedVersion) {
            console.log('First-time setup, no migration needed');
            this.setVersion(CURRENT_VERSION);
            return;
        }

        if (storedVersion === CURRENT_VERSION) {
            console.log('Storage is up to date');
            return;
        }

        console.log(`Migrating storage from ${storedVersion} to ${CURRENT_VERSION}`);

        try {
            // Migration logic here
            // For now, we'll just update the version
            this.setVersion(CURRENT_VERSION);

            console.log('Migration completed successfully');
        } catch (error) {
            console.error('Migration failed:', error);
            throw error;
        }
    }

    /**
     * Gets storage usage information
     */
    getStorageInfo(): { used: number; available: number; percentage: number } | null {
        if (!this.isAvailable()) {
            return null;
        }

        try {
            // Estimate storage size
            let totalSize = 0;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    const value = localStorage.getItem(key);
                    if (value) {
                        totalSize += key.length + value.length;
                    }
                }
            }

            // Most browsers limit localStorage to 5-10MB
            const estimatedLimit = 5 * 1024 * 1024; // 5MB
            const percentage = (totalSize / estimatedLimit) * 100;

            return {
                used: totalSize,
                available: estimatedLimit - totalSize,
                percentage: Math.min(percentage, 100),
            };
        } catch {
            return null;
        }
    }
}

// Export singleton instance
export const storage = new StorageService();

// Export class for testing
export { StorageService };
