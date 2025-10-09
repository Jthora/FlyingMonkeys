/**
 * Key derivation using Argon2id for PIN-based vault encryption.
 * Provides memory-hard KDF to resist brute force attacks.
 */

import {
  crypto_pwhash,
  randombytes_buf,
  crypto_pwhash_ALG_ARGON2ID13,
  crypto_pwhash_OPSLIMIT_INTERACTIVE,
  crypto_pwhash_MEMLIMIT_INTERACTIVE,
  crypto_pwhash_SALTBYTES,
} from 'react-native-libsodium';

/** Key length for XSalsa20-Poly1305 (32 bytes) */
const KEY_LENGTH = 32;

/**
 * Generates a cryptographically secure random salt.
 * @returns Promise resolving to 16-byte salt
 */
export async function generateSalt(): Promise<Uint8Array> {
  return randombytes_buf(crypto_pwhash_SALTBYTES);
}

/**
 * Derives an encryption key from a PIN using Argon2id.
 * Uses interactive parameters optimized for mobile devices.
 *
 * @param pin - User's PIN (4-6 digits typical)
 * @param salt - 16-byte salt (store this with encrypted vault)
 * @returns Promise resolving to 32-byte encryption key
 */
export async function deriveKey(
  pin: string,
  salt: Uint8Array,
): Promise<Uint8Array> {
  if (!pin || pin.length < 4) {
    throw new Error('PIN must be at least 4 characters');
  }

  if (salt.length !== crypto_pwhash_SALTBYTES) {
    throw new Error(`Salt must be ${crypto_pwhash_SALTBYTES} bytes`);
  }

  // Convert PIN string to Uint8Array
  const encoder = new TextEncoder();
  const pinBytes = encoder.encode(pin);

  try {
    const key = await crypto_pwhash(
      KEY_LENGTH,
      pinBytes,
      salt,
      crypto_pwhash_OPSLIMIT_INTERACTIVE,
      crypto_pwhash_MEMLIMIT_INTERACTIVE,
      crypto_pwhash_ALG_ARGON2ID13,
    );

    return key;
  } catch (error) {
    throw new Error(
      `Key derivation failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
}

/**
 * Converts Uint8Array to base64 string for storage.
 */
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  const binString = Array.from(bytes, byte => String.fromCodePoint(byte)).join(
    '',
  );
  return btoa(binString);
}

/**
 * Converts base64 string back to Uint8Array.
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  const binString = atob(base64);
  return Uint8Array.from(binString, char => char.codePointAt(0)!);
}
