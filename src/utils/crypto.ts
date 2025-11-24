/**
 * Password hashing utilities using Web Crypto API
 * No external dependencies required - uses browser's native crypto
 */

const ITERATIONS = 100000; // PBKDF2 iterations
const HASH_LENGTH = 32; // 32 bytes = 256 bits
const SALT_LENGTH = 16; // 16 bytes = 128 bits

/**
 * Converts an ArrayBuffer to a hex string
 */
function bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Converts a hex string to an ArrayBuffer
 */
function hexToBuffer(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

/**
 * Generates a random salt
 */
function generateSalt(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Derives a key from a password using PBKDF2
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    // Import password as a CryptoKey
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );

    // Derive bits using PBKDF2
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: ITERATIONS,
            hash: 'SHA-256'
        },
        keyMaterial,
        HASH_LENGTH * 8 // bits
    );

    return derivedBits;
}

/**
 * Hashes a password using PBKDF2 with a random salt
 * Returns a string in the format: salt:hash (both in hex)
 * 
 * @param password - Plain text password to hash
 * @returns Promise<string> - Hashed password with salt
 */
export async function hashPassword(password: string): Promise<string> {
    if (!password || password.length === 0) {
        throw new Error('Password cannot be empty');
    }

    const salt = generateSalt();
    const hash = await deriveKey(password, salt);

    const saltHex = bufferToHex(salt);
    const hashHex = bufferToHex(hash);

    return `${saltHex}:${hashHex}`;
}

/**
 * Verifies a password against a stored hash
 * 
 * @param password - Plain text password to verify
 * @param storedHash - Stored hash in format salt:hash
 * @returns Promise<boolean> - True if password matches
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    if (!password || !storedHash) {
        return false;
    }

    try {
        const [saltHex, expectedHashHex] = storedHash.split(':');

        if (!saltHex || !expectedHashHex) {
            return false;
        }

        const salt = hexToBuffer(saltHex);
        const actualHash = await deriveKey(password, salt);
        const actualHashHex = bufferToHex(actualHash);

        // Constant-time comparison to prevent timing attacks
        return actualHashHex === expectedHashHex;
    } catch (error) {
        console.error('Error verifying password:', error);
        return false;
    }
}

/**
 * Checks if a string is a hashed password (has salt:hash format)
 */
export function isHashedPassword(value: string): boolean {
    if (!value || typeof value !== 'string') {
        return false;
    }

    const parts = value.split(':');
    if (parts.length !== 2) {
        return false;
    }

    const [salt, hash] = parts;
    // Check if both parts are valid hex strings of expected length
    return (
        salt.length === SALT_LENGTH * 2 &&
        hash.length === HASH_LENGTH * 2 &&
        /^[0-9a-f]+$/i.test(salt) &&
        /^[0-9a-f]+$/i.test(hash)
    );
}
