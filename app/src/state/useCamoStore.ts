/**
 * Camouflage state store: manages curtain activation and session snapshot.
 */

import {create} from 'zustand';
import type {SessionState} from './useSessionStore';

/**
 * Snapshot of session state to restore after camouflage.
 */
export type SessionSnapshot = Pick<
  SessionState,
  | 'currentFlow'
  | 'currentIndex'
  | 'currentCard'
  | 'upcomingCards'
  | 'heatPlayer'
  | 'heatOpponent'
  | 'flightPath'
  | 'timerElapsed'
  | 'isWarning'
>;

/**
 * Camouflage curtain state.
 */
export interface CamoState {
  // Curtain state
  isActive: boolean;
  activatedAt: Date | null;
  lastSnapshot: SessionSnapshot | null;

  // Actions
  activate: (snapshot: SessionSnapshot) => void;
  deactivate: () => void;
  getSnapshot: () => SessionSnapshot | null;
}

/**
 * Camouflage store using Zustand.
 */
export const useCamoStore = create<CamoState>(set => ({
  // Initial state
  isActive: false,
  activatedAt: null,
  lastSnapshot: null,

  // Activate camouflage curtain and save session snapshot
  activate: snapshot => {
    set({
      isActive: true,
      activatedAt: new Date(),
      lastSnapshot: snapshot,
    });
  },

  // Deactivate camouflage curtain
  deactivate: () => {
    set({
      isActive: false,
      activatedAt: null,
    });
  },

  // Get saved snapshot
  getSnapshot: () => {
    return null; // Access via Zustand state selector
  },
}));
