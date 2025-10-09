/**
 * Type definitions for react-native-libsodium
 * Provides Argon2id key derivation and XSalsa20-Poly1305 encryption
 */

declare module 'react-native-libsodium' {
  // Key derivation (Argon2id)
  export function crypto_pwhash(
    keyLength: number,
    password: Uint8Array,
    salt: Uint8Array,
    opsLimit: number,
    memLimit: number,
    algorithm: number,
  ): Promise<Uint8Array>;

  export function randombytes_buf(length: number): Promise<Uint8Array>;

  export const crypto_pwhash_ALG_ARGON2ID13: number;
  export const crypto_pwhash_OPSLIMIT_INTERACTIVE: number;
  export const crypto_pwhash_MEMLIMIT_INTERACTIVE: number;
  export const crypto_pwhash_SALTBYTES: number;

  // Authenticated encryption (XSalsa20-Poly1305)
  export function crypto_secretbox_easy(
    message: Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array,
  ): Promise<Uint8Array>;

  export function crypto_secretbox_open_easy(
    ciphertext: Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array,
  ): Promise<Uint8Array>;

  export const crypto_secretbox_NONCEBYTES: number;
  export const crypto_secretbox_KEYBYTES: number;
  export const crypto_secretbox_MACBYTES: number;
}
