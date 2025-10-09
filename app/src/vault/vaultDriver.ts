/**
 * Vault persistence layer using react-native-fs.
 * Handles encrypted storage of cards, flows, and vault metadata.
 */

import RNFS from 'react-native-fs';
import {
  deriveKey,
  generateSalt,
  uint8ArrayToBase64,
  base64ToUint8Array,
} from './keyDerivation';
import {encryptJSON, decryptJSON, type EncryptedPayload} from './encryption';
import type {VaultData, VaultMetadata} from './types';

/** Path to encrypted vault file */
const VAULT_PATH = `${RNFS.DocumentDirectoryPath}/vault.encrypted`;

/** Path to salt file (stored separately, not secret) */
const SALT_PATH = `${RNFS.DocumentDirectoryPath}/vault.salt`;

/** Path to vault metadata (not encrypted, stores lockout state) */
const METADATA_PATH = `${RNFS.DocumentDirectoryPath}/vault.meta.json`;

/** Maximum failed attempts before lockout */
const MAX_FAILED_ATTEMPTS = 3;

/** Lockout duration in milliseconds (60 seconds) */
const LOCKOUT_DURATION_MS = 60_000;

/**
 * Checks if vault file exists on disk.
 */
export async function vaultExists(): Promise<boolean> {
  return RNFS.exists(VAULT_PATH);
}

/**
 * Loads vault metadata (lockout state, creation time).
 */
export async function loadMetadata(): Promise<VaultMetadata> {
  try {
    const metaExists = await RNFS.exists(METADATA_PATH);
    if (!metaExists) {
      return {
        exists: false,
        failedAttempts: 0,
      };
    }

    const json = await RNFS.readFile(METADATA_PATH, 'utf8');
    return JSON.parse(json) as VaultMetadata;
  } catch (error) {
    // Corrupted metadata; reset to safe defaults
    return {
      exists: false,
      failedAttempts: 0,
    };
  }
}

/**
 * Saves vault metadata to disk.
 */
export async function saveMetadata(metadata: VaultMetadata): Promise<void> {
  const json = JSON.stringify(metadata, null, 2);
  await RNFS.writeFile(METADATA_PATH, json, 'utf8');
}

/**
 * Checks if vault is currently locked out due to failed attempts.
 */
export async function isLockedOut(): Promise<boolean> {
  const metadata = await loadMetadata();

  if (metadata.failedAttempts < MAX_FAILED_ATTEMPTS) {
    return false;
  }

  if (!metadata.lastFailedAttempt) {
    return false;
  }

  const lastFailed = new Date(metadata.lastFailedAttempt).getTime();
  const now = Date.now();
  const elapsed = now - lastFailed;

  // Lockout expires after duration
  if (elapsed >= LOCKOUT_DURATION_MS) {
    // Reset failed attempts
    const {lastFailedAttempt: _, ...rest} = metadata;
    await saveMetadata({
      ...rest,
      failedAttempts: 0,
    });
    return false;
  }

  return true;
}

/**
 * Records a failed unlock attempt.
 */
export async function recordFailedAttempt(): Promise<void> {
  const metadata = await loadMetadata();
  await saveMetadata({
    ...metadata,
    failedAttempts: metadata.failedAttempts + 1,
    lastFailedAttempt: new Date().toISOString(),
  });
}

/**
 * Resets failed attempts counter (on successful unlock).
 */
export async function resetFailedAttempts(): Promise<void> {
  const metadata = await loadMetadata();
  const {lastFailedAttempt: _, ...rest} = metadata;
  await saveMetadata({
    ...rest,
    failedAttempts: 0,
  });
}

/**
 * Creates a new encrypted vault with seed data.
 *
 * @param pin - User's PIN for key derivation
 * @param seedData - Initial cards and flows
 */
export async function createVault(
  pin: string,
  seedData: Omit<VaultData, 'salt' | 'version' | 'lastModified'>,
): Promise<void> {
  // Generate new salt for this vault
  const salt = await generateSalt();
  const saltBase64 = uint8ArrayToBase64(salt);

  // Derive encryption key from PIN
  const key = await deriveKey(pin, salt);

  // Build vault data structure
  const vaultData: VaultData = {
    ...seedData,
    salt: saltBase64,
    version: 1,
    lastModified: new Date().toISOString(),
  };

  // Encrypt vault
  const encrypted = await encryptJSON(vaultData, key);

  // Write to disk
  const json = JSON.stringify(encrypted, null, 2);
  await RNFS.writeFile(VAULT_PATH, json, 'utf8');

  // Write salt separately (not secret, but needed for key derivation)
  await RNFS.writeFile(SALT_PATH, saltBase64, 'utf8');

  // Update metadata
  await saveMetadata({
    exists: true,
    createdAt: new Date().toISOString(),
    failedAttempts: 0,
  });
}

/**
 * Loads and decrypts vault using PIN.
 *
 * @param pin - User's PIN
 * @returns Decrypted vault data
 * @throws Error if PIN is incorrect or vault is locked out
 */
export async function loadVault(pin: string): Promise<VaultData> {
  // Check lockout status
  if (await isLockedOut()) {
    throw new Error(
      'Vault locked due to failed attempts. Try again in 60 seconds.',
    );
  }

  // Read encrypted vault file
  const exists = await vaultExists();
  if (!exists) {
    throw new Error('Vault does not exist. Create a new vault first.');
  }

  try {
    const json = await RNFS.readFile(VAULT_PATH, 'utf8');
    const encrypted = JSON.parse(json) as EncryptedPayload;

    // We need to store the salt in metadata since we need it to derive the key
    // For now, attempt to decrypt with a temporary approach
    // The salt is actually stored IN the vault data, so we have a chicken-egg problem
    // Solution: Store salt separately in metadata, OR use a fixed salt (less secure)
    // Best practice: store salt with the ciphertext (it's not secret)

    // Let's read salt from a separate file for now
    const saltBase64 = await RNFS.readFile(SALT_PATH, 'utf8');
    const salt = base64ToUint8Array(saltBase64);

    // Derive key from PIN and salt
    const key = await deriveKey(pin, salt);

    // Decrypt vault
    const vaultData = await decryptJSON<VaultData>(encrypted, key);

    // Success - reset failed attempts
    await resetFailedAttempts();

    return vaultData;
  } catch (error) {
    await recordFailedAttempt();
    throw new Error('Invalid PIN or corrupted vault');
  }
}

/**
 * Saves vault data back to disk (re-encrypts with same PIN).
 *
 * @param vaultData - Updated vault data
 * @param pin - User's PIN
 */
export async function saveVault(
  vaultData: VaultData,
  pin: string,
): Promise<void> {
  // Use existing salt from vault data
  const salt = base64ToUint8Array(vaultData.salt);

  // Derive key
  const key = await deriveKey(pin, salt);

  // Update timestamp
  const updated: VaultData = {
    ...vaultData,
    lastModified: new Date().toISOString(),
  };

  // Encrypt
  const encrypted = await encryptJSON(updated, key);

  // Write to disk
  const json = JSON.stringify(encrypted, null, 2);
  await RNFS.writeFile(VAULT_PATH, json, 'utf8');
}

/**
 * Permanently deletes the vault (panic wipe).
 * This is IRREVERSIBLE.
 */
export async function destroyVault(): Promise<void> {
  try {
    if (await RNFS.exists(VAULT_PATH)) {
      await RNFS.unlink(VAULT_PATH);
    }
    if (await RNFS.exists(SALT_PATH)) {
      await RNFS.unlink(SALT_PATH);
    }
    if (await RNFS.exists(METADATA_PATH)) {
      await RNFS.unlink(METADATA_PATH);
    }
  } catch (error) {
    // Silent fail on destroy - don't leak existence info
  }
}
