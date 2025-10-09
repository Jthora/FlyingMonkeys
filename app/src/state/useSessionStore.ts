/**
 * Session state store: manages active gameplay session.
 * Tracks current flow, card position, heat, flight path, and timer state.
 */

import {create} from 'zustand';
import type {Card, Flow} from '@/vault/types';

/**
 * Session state for active Live Stack gameplay.
 */
export interface SessionState {
  // Flow & cards
  currentFlow: Flow | null;
  currentIndex: number;
  currentCard: Card | null;
  upcomingCards: Card[];

  // Gameplay metrics
  heatPlayer: number; // 0-10 scale
  heatOpponent: number; // 0-10 scale
  flightPath: number; // 0-100 scale
  timerElapsed: number; // Current turn elapsed time in seconds
  isWarning: boolean; // True if past 3-second warning threshold

  // Session lifecycle
  isLive: boolean; // True when Live Stack is active
  sessionStartedAt: Date | null;

  // Actions
  startSession: (flow: Flow, cards: Card[]) => void;
  advanceCard: () => void;
  adjustHeat: (delta: number, target: 'player' | 'opponent') => void;
  updateTimer: (elapsed: number, isWarning: boolean) => void;
  endSession: () => void;
  resetSession: () => void;
}

/**
 * Session store using Zustand.
 */
export const useSessionStore = create<SessionState>((set, get) => ({
  // Initial state
  currentFlow: null,
  currentIndex: 0,
  currentCard: null,
  upcomingCards: [],

  heatPlayer: 5,
  heatOpponent: 5,
  flightPath: 50,
  timerElapsed: 0,
  isWarning: false,

  isLive: false,
  sessionStartedAt: null,

  // Start new session with a flow
  startSession: (flow, cards) => {
    const flowCards = flow.sequence
      .map(cardId => cards.find(c => c.id === cardId))
      .filter((c): c is Card => c !== undefined);

    if (flowCards.length === 0) {
      throw new Error('Flow has no valid cards');
    }

    set({
      currentFlow: flow,
      currentIndex: 0,
      currentCard: flowCards[0] ?? null,
      upcomingCards: flowCards.slice(1, 3),
      heatPlayer: 5,
      heatOpponent: 5,
      flightPath: 50,
      timerElapsed: 0,
      isWarning: false,
      isLive: true,
      sessionStartedAt: new Date(),
    });
  },

  // Advance to next card in sequence
  advanceCard: () => {
    const {currentFlow, currentIndex} = get();
    if (!currentFlow) {
      return;
    }

    const allCards = currentFlow.sequence;
    const nextIndex = currentIndex + 1;

    if (nextIndex >= allCards.length) {
      // Flow complete
      set({
        currentIndex: allCards.length,
        currentCard: null,
        upcomingCards: [],
      });
      return;
    }

    // Update indices (requires full card array from vault store)
    set({
      currentIndex: nextIndex,
      timerElapsed: 0,
      isWarning: false,
    });
  },

  // Adjust heat level
  adjustHeat: (delta, target) => {
    set(state => {
      if (target === 'player') {
        return {
          heatPlayer: Math.max(0, Math.min(10, state.heatPlayer + delta)),
        };
      } else {
        return {
          heatOpponent: Math.max(0, Math.min(10, state.heatOpponent + delta)),
        };
      }
    });
  },

  // Update timer state from TurnEngine
  updateTimer: (elapsed, isWarning) => {
    set({timerElapsed: elapsed, isWarning});
  },

  // End current session
  endSession: () => {
    set({
      isLive: false,
    });
  },

  // Reset session completely
  resetSession: () => {
    set({
      currentFlow: null,
      currentIndex: 0,
      currentCard: null,
      upcomingCards: [],
      heatPlayer: 5,
      heatOpponent: 5,
      flightPath: 50,
      timerElapsed: 0,
      isWarning: false,
      isLive: false,
      sessionStartedAt: null,
    });
  },
}));
