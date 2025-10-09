/**
 * Core data types for Flying Monkeys vault system.
 */

/**
 * Card element representing spiritual/intellectual/emotional/physical nature.
 */
export type CardElement = 'Fire' | 'Air' | 'Water' | 'Earth';

/**
 * Card modality representing attack/block/parry stance.
 */
export type CardModality = 'Cardinal' | 'Fixed' | 'Mutable';

/**
 * Card classification for tactical role.
 */
export type CardClass =
  | 'Engagement'
  | 'Trap'
  | 'Counter'
  | 'Calm'
  | 'Truth'
  | 'Spirit'
  | 'Receipts'
  | 'Combo';

/**
 * A single card containing tactical response language.
 */
export interface Card {
  /** Unique identifier (e.g., "engage.flight-manifest") */
  id: string;

  /** Element nature */
  element: CardElement;

  /** Modality stance */
  modality: CardModality;

  /** Tactical class */
  class: CardClass;

  /** The exact line the player speaks aloud */
  line: string;

  /** Private coaching text shown only to player */
  cue: string;

  /** Impact on player's heat level (-2 to +3) */
  heatImpact: number;

  /** Impact on flight path control (-5 to +10) */
  flightDelta: number;

  /** Optional: turns before card can be reused */
  cooldown?: number;

  /** Card schema version */
  version: number;
}

/**
 * A flow route defining a sequence of cards for a specific scenario.
 */
export interface Flow {
  /** Unique identifier (e.g., "flow.faux-intervention") */
  id: string;

  /** Display title */
  title: string;

  /** Trigger phrase that starts this flow */
  trigger: string;

  /** Ordered array of card IDs to cycle through */
  sequence: string[];

  /** Card IDs of essential counters player should have */
  requiredCounters: string[];

  /** Flow schema version */
  version: number;
}

/**
 * Complete vault data structure.
 */
export interface VaultData {
  /** All available cards */
  cards: Card[];

  /** All available flows */
  flows: Flow[];

  /** Salt used for key derivation (base64) */
  salt: string;

  /** Vault schema version for future migrations */
  version: number;

  /** Timestamp of last modification */
  lastModified: string;
}

/**
 * Metadata about vault state (stored separately from encrypted data).
 */
export interface VaultMetadata {
  /** Whether vault has been initialized */
  exists: boolean;

  /** Timestamp of creation */
  createdAt?: string;

  /** Number of failed unlock attempts since last success */
  failedAttempts: number;

  /** Timestamp of last failed attempt (for lockout timer) */
  lastFailedAttempt?: string;
}
