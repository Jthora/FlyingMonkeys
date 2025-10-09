/**
 * Vault state store: manages encrypted vault data and unlock state.
 * Provides access to cards, flows, and vault lifecycle.
 */

import {create} from 'zustand';
import type {Card, Flow, VaultData} from '@/vault/types';

/**
 * Vault state for managing encrypted card/flow data.
 */
export interface VaultState {
  // Unlock state
  isUnlocked: boolean;
  pin: string | null; // Held in memory only during session

  // Vault data
  cards: Card[];
  flows: Flow[];
  salt: string | null;
  lastModified: string | null;

  // Actions
  unlock: (pin: string, vaultData: VaultData) => void;
  lock: () => void;
  updateCards: (cards: Card[]) => void;
  updateFlows: (flows: Flow[]) => void;
  getCardById: (id: string) => Card | undefined;
  getFlowById: (id: string) => Flow | undefined;
}

/**
 * Vault store using Zustand.
 */
export const useVaultStore = create<VaultState>((set, get) => ({
  // Initial state
  isUnlocked: false,
  pin: null,
  cards: [],
  flows: [],
  salt: null,
  lastModified: null,

  // Unlock vault with PIN and load data
  unlock: (pin, vaultData) => {
    set({
      isUnlocked: true,
      pin,
      cards: vaultData.cards,
      flows: vaultData.flows,
      salt: vaultData.salt,
      lastModified: vaultData.lastModified,
    });
  },

  // Lock vault and clear sensitive data
  lock: () => {
    set({
      isUnlocked: false,
      pin: null,
      cards: [],
      flows: [],
      salt: null,
      lastModified: null,
    });
  },

  // Update cards in vault (will need to save to disk separately)
  updateCards: cards => {
    set({cards, lastModified: new Date().toISOString()});
  },

  // Update flows in vault
  updateFlows: flows => {
    set({flows, lastModified: new Date().toISOString()});
  },

  // Lookup helpers
  getCardById: id => {
    return get().cards.find(card => card.id === id);
  },

  getFlowById: id => {
    return get().flows.find(flow => flow.id === id);
  },
}));
