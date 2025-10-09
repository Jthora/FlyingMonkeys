/**
 * Authenticated encryption using XSalsa20-Poly1305.
 * Provides confidentiality and integrity for vault data.
 */

import {
  crypto_secretbox_easy,
  crypto_secretbox_open_easy,
  crypto_secretbox_NONCEBYTES,
  crypto_secretbox_KEYBYTES,
  randombytes_buf,
} from 'react-native-libsodium';

import {uint8ArrayToBase64, base64ToUint8Array} from './keyDerivation';

/**
 * Encrypted data structure stored on disk.
 */
export interface EncryptedPayload {
  nonce: string; // base64-encoded nonce
  ciphertext: string; // base64-encoded encrypted data
  version: number; // Schema version for future migrations
}

/**
 * Encrypts plaintext data using authenticated encryption.
 *
 * @param plaintext - UTF-8 string to encrypt (JSON-serialized vault data)
 * @param key - 32-byte encryption key from deriveKey()
 * @returns Promise resolving to encrypted payload ready for storage
 */
export async function encrypt(
  plaintext: string,
  key: Uint8Array,
): Promise<EncryptedPayload> {
  if (key.length !== crypto_secretbox_KEYBYTES) {
    throw new Error(
      `Encryption key must be ${crypto_secretbox_KEYBYTES} bytes`,
    );
  }

  // Generate random nonce (never reuse with same key)
  const nonce = await randombytes_buf(crypto_secretbox_NONCEBYTES);

  // Convert plaintext to bytes
  const encoder = new TextEncoder();
  const plaintextBytes = encoder.encode(plaintext);

  try {
    // Encrypt with XSalsa20-Poly1305
    const ciphertext = await crypto_secretbox_easy(plaintextBytes, nonce, key);

    return {
      nonce: uint8ArrayToBase64(nonce),
      ciphertext: uint8ArrayToBase64(ciphertext),
      version: 1,
    };
  } catch (error) {
    throw new Error(
      `Encryption failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
}

/**
 * Decrypts ciphertext back to plaintext.
 *
 * @param payload - Encrypted payload from encrypt()
 * @param key - Same 32-byte key used for encryption
 * @returns Promise resolving to decrypted UTF-8 string
 * @throws Error if authentication fails (wrong key or tampered data)
 */
export async function decrypt(
  payload: EncryptedPayload,
  key: Uint8Array,
): Promise<string> {
  if (key.length !== crypto_secretbox_KEYBYTES) {
    throw new Error(
      `Decryption key must be ${crypto_secretbox_KEYBYTES} bytes`,
    );
  }

  if (payload.version !== 1) {
    throw new Error(`Unsupported vault version: ${payload.version}`);
  }

  try {
    // Decode base64 to bytes
    const nonce = base64ToUint8Array(payload.nonce);
    const ciphertext = base64ToUint8Array(payload.ciphertext);

    // Decrypt and verify MAC
    const plaintextBytes = await crypto_secretbox_open_easy(
      ciphertext,
      nonce,
      key,
    );

    // Convert bytes to string
    const decoder = new TextDecoder();
    return decoder.decode(plaintextBytes);
  } catch (error) {
    // This typically means wrong PIN or tampered data
    throw new Error('Decryption failed: invalid PIN or corrupted vault');
  }
}

/**
 * Convenience wrapper to encrypt JSON-serializable data.
 */
export async function encryptJSON<T>(
  data: T,
  key: Uint8Array,
): Promise<EncryptedPayload> {
  const json = JSON.stringify(data);
  return encrypt(json, key);
}

/**
 * Convenience wrapper to decrypt and parse JSON data.
 */
export async function decryptJSON<T>(
  payload: EncryptedPayload,
  key: Uint8Array,
): Promise<T> {
  const json = await decrypt(payload, key);
  return JSON.parse(json) as T;
}
