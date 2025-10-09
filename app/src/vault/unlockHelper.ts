/**
 * Helper functions for vault unlock flow with structured error handling.
 */

import {
  loadVault,
  vaultExists,
  loadMetadata,
  isLockedOut as checkLockedOut,
} from './vaultDriver';
import type {VaultData} from './types';

const LOCKOUT_DURATION_MS = 60_000;
const MAX_FAILED_ATTEMPTS = 3;

/**
 * Result type for vault unlock attempts.
 */
export type UnlockResult =
  | {status: 'success'; cards: VaultData['cards']; flows: VaultData['flows']}
  | {status: 'wrong-pin'; attemptsRemaining: number}
  | {status: 'locked-out'; remainingLockoutMs: number}
  | {status: 'no-vault'};

/**
 * Attempts to unlock the vault with the given PIN.
 * Returns a structured result instead of throwing errors.
 */
export async function attemptUnlock(pin: string): Promise<UnlockResult> {
  // Check if vault exists
  const exists = await vaultExists();
  if (!exists) {
    return {status: 'no-vault'};
  }

  // Check lockout status
  const lockedOut = await checkLockedOut();
  if (lockedOut) {
    const metadata = await loadMetadata();
    if (metadata.lastFailedAttempt) {
      const lastFailed = new Date(metadata.lastFailedAttempt).getTime();
      const now = Date.now();
      const elapsed = now - lastFailed;
      const remaining = Math.max(0, LOCKOUT_DURATION_MS - elapsed);
      return {status: 'locked-out', remainingLockoutMs: remaining};
    }
    // Shouldn't happen, but fall back to full duration
    return {status: 'locked-out', remainingLockoutMs: LOCKOUT_DURATION_MS};
  }

  // Attempt to load vault
  try {
    const vaultData = await loadVault(pin);
    return {
      status: 'success',
      cards: vaultData.cards,
      flows: vaultData.flows,
    };
  } catch (error) {
    // Wrong PIN - check remaining attempts
    const metadata = await loadMetadata();
    const attemptsRemaining = MAX_FAILED_ATTEMPTS - metadata.failedAttempts;

    if (attemptsRemaining <= 0) {
      // Just locked out
      const metadata2 = await loadMetadata();
      if (metadata2.lastFailedAttempt) {
        const lastFailed = new Date(metadata2.lastFailedAttempt).getTime();
        const now = Date.now();
        const elapsed = now - lastFailed;
        const remaining = Math.max(0, LOCKOUT_DURATION_MS - elapsed);
        return {status: 'locked-out', remainingLockoutMs: remaining};
      }
      return {status: 'locked-out', remainingLockoutMs: LOCKOUT_DURATION_MS};
    }

    return {status: 'wrong-pin', attemptsRemaining};
  }
}

/**
 * Checks if the vault is currently locked out.
 * Returns remaining lockout time in milliseconds if locked out, otherwise null.
 */
export async function checkLockoutStatus(): Promise<number | null> {
  const exists = await vaultExists();
  if (!exists) {
    return null;
  }

  const lockedOut = await checkLockedOut();
  if (!lockedOut) {
    return null;
  }

  const metadata = await loadMetadata();
  if (metadata.lastFailedAttempt) {
    const lastFailed = new Date(metadata.lastFailedAttempt).getTime();
    const now = Date.now();
    const elapsed = now - lastFailed;
    const remaining = Math.max(0, LOCKOUT_DURATION_MS - elapsed);
    return remaining;
  }

  return LOCKOUT_DURATION_MS;
}
