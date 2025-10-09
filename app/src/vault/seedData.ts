/**
 * Seed data: starter cards and flows for initial vault creation.
 * These are loaded when a new vault is created.
 */

import type {Card, Flow} from '@/vault/types';

/**
 * Starter card deck (15 essential cards).
 */
export const seedCards: Card[] = [
  // ENGAGEMENT CARDS
  {
    id: 'engage.flight-manifest',
    element: 'Air',
    modality: 'Cardinal',
    class: 'Engagement',
    line: "We're following my checklist—first up is the timeline.",
    cue: 'Establish flight path agenda. Keep tone firm and measured.',
    heatImpact: 0,
    flightDelta: 5,
    cooldown: 0,
    version: 1,
  },
  {
    id: 'engage.receipt-brief',
    element: 'Earth',
    modality: 'Cardinal',
    class: 'Engagement',
    line: "I've got the receipts printed; we'll go through them one at a time.",
    cue: 'Signal evidence ready. Maintain calm authority.',
    heatImpact: 0,
    flightDelta: 4,
    cooldown: 0,
    version: 1,
  },

  // TRAP CARDS
  {
    id: 'trap.flight-lock',
    element: 'Air',
    modality: 'Fixed',
    class: 'Trap',
    line: 'Pause. We finish this timeline before touching anything else.',
    cue: 'Lock conversation lane. Sets up combo opportunity.',
    heatImpact: 1,
    flightDelta: 6,
    cooldown: 2,
    version: 1,
  },
  {
    id: 'trap.mirror-ask',
    element: 'Water',
    modality: 'Mutable',
    class: 'Trap',
    line: "Repeat exactly when you say that happened—I'm logging it.",
    cue: 'Force them to restate claim. Catch inconsistency.',
    heatImpact: 0,
    flightDelta: 3,
    cooldown: 0,
    version: 1,
  },

  // COUNTER CARDS
  {
    id: 'counter.timeout-shield',
    element: 'Earth',
    modality: 'Fixed',
    class: 'Counter',
    line: "No timeouts—you're trying to dodge the point and we're not moving.",
    cue: 'Block timeout attempt. Deploy within 2 seconds.',
    heatImpact: 1,
    flightDelta: 2,
    cooldown: 1,
    version: 1,
  },
  {
    id: 'counter.darvo-invert',
    element: 'Fire',
    modality: 'Mutable',
    class: 'Counter',
    line: 'Nice try flipping this—answer the original question now.',
    cue: 'Recognize DARVO. Slam back to topic immediately.',
    heatImpact: 1,
    flightDelta: 5,
    cooldown: 0,
    version: 1,
  },
  {
    id: 'counter.flying-monkey',
    element: 'Air',
    modality: 'Mutable',
    class: 'Counter',
    line: "That's their narrative—show me YOUR evidence or stop repeating it.",
    cue: 'Break flying monkey pattern. Demand original thought.',
    heatImpact: 2,
    flightDelta: 4,
    cooldown: 1,
    version: 1,
  },

  // TRUTH & RECEIPTS CARDS
  {
    id: 'truth.gov-ledger',
    element: 'Earth',
    modality: 'Cardinal',
    class: 'Truth',
    line: "Here's the probate filing—page 3 proves what I said.",
    cue: 'Flash verified document. Keep tone neutral.',
    heatImpact: 0,
    flightDelta: 7,
    cooldown: 0,
    version: 1,
  },
  {
    id: 'receipt.timeline-share',
    element: 'Air',
    modality: 'Fixed',
    class: 'Receipts',
    line: "I logged every call with screenshots; we're reviewing them now.",
    cue: 'Force factual plane. Maintain calm, clinical tone.',
    heatImpact: 1,
    flightDelta: 6,
    cooldown: 0,
    version: 1,
  },

  // CALM CARDS
  {
    id: 'calm.breath-anchor',
    element: 'Water',
    modality: 'Fixed',
    class: 'Calm',
    line: "Pause. I'm steady, and I'll continue once you stop shouting.",
    cue: 'Reduce own heat. Mirror deep breathing.',
    heatImpact: -2,
    flightDelta: 1,
    cooldown: 0,
    version: 1,
  },
  {
    id: 'calm.grounding',
    element: 'Earth',
    modality: 'Fixed',
    class: 'Calm',
    line: "Let's bring it down. Facts first, emotion second.",
    cue: 'De-escalate heat. Return to logical frame.',
    heatImpact: -1,
    flightDelta: 2,
    cooldown: 0,
    version: 1,
  },

  // SPIRIT CARDS
  {
    id: 'spirit.angel-guard',
    element: 'Fire',
    modality: 'Cardinal',
    class: 'Spirit',
    line: "Angels hear everything—we're keeping this honest right now.",
    cue: 'Spiritual wedge. Religious opponents reluctant to attack.',
    heatImpact: 0,
    flightDelta: 4,
    cooldown: 0,
    version: 1,
  },
  {
    id: 'spirit.truth-witness',
    element: 'Fire',
    modality: 'Fixed',
    class: 'Spirit',
    line: 'If you believe in God, then stand on truth—not manipulation.',
    cue: 'Force religious consistency. Hold moral high ground.',
    heatImpact: 1,
    flightDelta: 5,
    cooldown: 1,
    version: 1,
  },

  // COMBO CARDS
  {
    id: 'combo.lockdown-init',
    element: 'Air',
    modality: 'Cardinal',
    class: 'Combo',
    line: "Lock it in—facts first, then whatever fantasy you're trying next.",
    cue: 'Enables Lockdown combo with Counter + Truth cards.',
    heatImpact: 1,
    flightDelta: 2,
    cooldown: 0,
    version: 1,
  },
  {
    id: 'combo.triple-calm',
    element: 'Water',
    modality: 'Mutable',
    class: 'Combo',
    line: "Bring it down. Now you'll listen while I lay out the sequence.",
    cue: 'Chains Calm → Empathy → Intelligence combo.',
    heatImpact: -1,
    flightDelta: 3,
    cooldown: 0,
    version: 1,
  },
];

/**
 * Starter flows (3 scenarios).
 */
export const seedFlows: Flow[] = [
  {
    id: 'flow.faux-intervention',
    title: 'Faux Intervention Defense',
    trigger: 'Family stages "intervention" to label you schizophrenic',
    sequence: [
      'engage.flight-manifest',
      'trap.flight-lock',
      'counter.timeout-shield',
      'truth.gov-ledger',
      'counter.darvo-invert',
      'spirit.angel-guard',
      'receipt.timeline-share',
      'calm.breath-anchor',
      'combo.lockdown-init',
    ],
    requiredCounters: ['counter.timeout-shield', 'counter.darvo-invert'],
    version: 1,
  },
  {
    id: 'flow.timeout-gauntlet',
    title: 'Timeout Counter Drill',
    trigger: 'Opponent repeatedly tries to interrupt and dodge',
    sequence: [
      'engage.receipt-brief',
      'counter.timeout-shield',
      'trap.mirror-ask',
      'counter.timeout-shield',
      'calm.grounding',
      'truth.gov-ledger',
      'counter.darvo-invert',
    ],
    requiredCounters: ['counter.timeout-shield'],
    version: 1,
  },
  {
    id: 'flow.darvo-counter',
    title: 'DARVO Shutdown Sequence',
    trigger: 'Opponent flips victim/offender roles',
    sequence: [
      'trap.flight-lock',
      'counter.darvo-invert',
      'receipt.timeline-share',
      'counter.darvo-invert',
      'spirit.truth-witness',
      'truth.gov-ledger',
      'calm.breath-anchor',
    ],
    requiredCounters: ['counter.darvo-invert', 'counter.flying-monkey'],
    version: 1,
  },
];
