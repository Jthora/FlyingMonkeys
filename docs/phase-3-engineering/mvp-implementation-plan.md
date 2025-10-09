# Flying Monkeys MVP Implementation Plan

## Executive Summary
Build a fully offline React Native app enabling a targeted individual to navigate hostile family interventions using pre-loaded card flows, 4-second turn timers, and instant camouflage—all without network dependencies or telemetry.

---

## MVP Scope Definition

### What's IN (Milestone 1 + 2)
**Core Features:**
1. **Lock & Vault Gate** – PIN authentication, panic wipe confirmation
2. **Ready Room** – Flow selector with 2-3 pre-loaded scenarios
3. **Live Stack HUD** – 4-second turn timer, card cycling, manual heat tracking
4. **Vault Drawer** – Basic card editor, 10-15 starter cards
5. **Camouflage Curtain** – Double-tap panic cover with neutral skin

**Data Layer:**
- Local encrypted storage (libsodium + react-native-fs)
- 3 pre-built flow routes (Faux Intervention, Timeout Gauntlet, DARVO Counter)
- 15-20 core cards covering Engagement, Trap, Counter, Calm, Truth types
- Zustand stores for session state, vault keys, current flow

**Technical Foundation:**
- Offline-first architecture (no network calls)
- 4-second turn loop with visual timer
- Manual heat/flight path tracking (honor system)
- Basic card schema validation (Zod)

### What's OUT (Post-MVP)
- Practice drills with extended timers
- Receipt file viewer and pairing
- Advanced combo system with auto-detection
- Multiple camouflage skins
- Backup import/export to SD/USB
- Duress PIN separate from main PIN
- Audio cues and haptic feedback
- Custom card creation UI
- Desktop companion tool

---

## Architecture Overview

### Data Models
```typescript
// Core entities
Card {
  id: string
  element: 'Fire' | 'Air' | 'Water' | 'Earth'
  modality: 'Cardinal' | 'Fixed' | 'Mutable'
  class: 'Engagement' | 'Trap' | 'Counter' | 'Calm' | 'Truth' | 'Spirit'
  line: string          // What player says
  cue: string           // Private coaching text
  heatImpact: number    // -2 to +3
  flightDelta: number   // -5 to +10
  cooldown?: number     // turns before reuse
}

Flow {
  id: string
  title: string
  trigger: string       // "They say you're schizophrenic"
  sequence: string[]    // Ordered card IDs
  requiredCounters: string[]  // Alert if missing
}

Session {
  flowId: string
  currentIndex: number
  heatPlayer: number
  heatOpponent: number
  flightPath: number    // 0-100
  startedAt: Date
}

Vault {
  cards: Card[]
  flows: Flow[]
  masterKey: Uint8Array  // Derived from PIN via Argon2id
}
```

### State Management (Zustand)
```typescript
// src/state/useSessionStore.ts
- currentFlow: Flow | null
- currentCard: Card | null
- upcomingCards: Card[]
- heatPlayer: number
- heatOpponent: number
- flightPath: number
- timerSeconds: number
- isLive: boolean

// src/state/useVaultStore.ts
- isUnlocked: boolean
- cards: Card[]
- flows: Flow[]
- masterKey: Uint8Array | null

// src/state/useCamoStore.ts
- isActive: boolean
- lastPausedState: SessionSnapshot
```

### Turn Engine (`src/turn/`)
```typescript
// turnEngine.ts
class TurnEngine {
  private intervalId: NodeJS.Timeout | null
  private tickCallback: (elapsed: number) => void
  
  start(durationSeconds: number = 4.0)
  pause()
  resume()
  reset()
  onTick(callback: (elapsed: number) => void)
}
```

### Encryption Layer (`src/vault/`)
```typescript
// keyDerivation.ts
async function deriveKey(pin: string, salt: Uint8Array): Promise<Uint8Array>
  // Uses Argon2id via react-native-libsodium

// vaultDriver.ts
async function encryptVault(data: VaultData, key: Uint8Array): Promise<string>
async function decryptVault(encrypted: string, key: Uint8Array): Promise<VaultData>
async function loadVault(pin: string): Promise<Vault>
async function saveVault(vault: Vault, pin: string): Promise<void>
```

---

## Implementation Phases

### Phase 1: Core Infrastructure (Week 1-2)
**Goal:** Establish vault encryption, navigation, and state stores

#### Tasks:
1. **Vault Driver Implementation**
   - [x] Scaffold created (placeholder exports exist)
   - [ ] Implement Argon2id key derivation wrapper
   - [ ] Build encrypt/decrypt helpers using XSalsa20-Poly1305
   - [ ] Create `loadVault()` and `saveVault()` functions
   - [ ] Add salt generation and storage strategy
   - [ ] Write unit tests for encryption round-trip

2. **State Store Setup**
   - [x] Zustand installed
   - [ ] Create `useSessionStore` with turn state
   - [ ] Create `useVaultStore` with cards/flows
   - [ ] Create `useCamoStore` for curtain state
   - [ ] Add persistence middleware (encrypted via vault driver)

3. **Turn Engine Module**
   - [x] Turn module placeholder created
   - [ ] Build `TurnEngine` class with interval management
   - [ ] Add tick callbacks for UI updates
   - [ ] Implement pause/resume/reset logic
   - [ ] Handle AutoSlack (missed turn) detection
   - [ ] Write timer accuracy tests

4. **Seed Data Creation**
   - [ ] Define 15 starter cards in JSON
   - [ ] Create 3 basic flows (Faux Intervention, Timeout Gauntlet, DARVO Counter)
   - [ ] Write migration script to load seed data on first launch
   - [ ] Add Zod schemas for validation

**Deliverable:** Working vault encryption, timer engine, and state stores with seed data

---

### Phase 2: Screen Implementation (Week 3-4)
**Goal:** Build LockGate, ReadyRoom, LiveStack screens with functional flows

#### Tasks:
1. **LockGate Screen Enhancement**
   - [x] Placeholder screen exists
   - [ ] Build PIN keypad component (4-6 digit)
   - [ ] Wire up vault unlock via `loadVault(pin)`
   - [ ] Add failed attempt counter (3 strikes → 60s lockout)
   - [ ] Implement panic wipe confirmation flow
   - [ ] Store unlock state in `useVaultStore`

2. **ReadyRoom Screen**
   - [x] Placeholder screen exists
   - [ ] Build flow selector list component
   - [ ] Show flow trigger, first card preview, card count
   - [ ] Add "missing counter" warning badge
   - [ ] Create "Launch Live Stack" button (validates flow selection)
   - [ ] Optional: 30-second warm-up countdown

3. **LiveStack HUD**
   - [x] Placeholder screen exists
   - [ ] Build Command Rail (timer bead, flight gauge, camo button)
   - [ ] Implement Route Window (current card + 2 upcoming)
   - [ ] Create Action Shelf buttons (Calm, Notes, Edit)
   - [ ] Wire timer to TurnEngine
   - [ ] Add manual heat adjustment (+/- buttons)
   - [ ] Implement card tap to advance turn
   - [ ] Build "Never say OK" flash warning at 3.0s
   - [ ] Add AutoSlack handler for missed turns
   - [ ] Create end session flow

4. **Camouflage Curtain**
   - [ ] Create neutral cover screen (e.g., "Flight Trainer")
   - [ ] Implement double-tap gesture on Command Rail
   - [ ] Save/restore session state when curtain activates
   - [ ] Add PIN re-entry after 5+ minutes
   - [ ] Build fake telemetry animation loop

5. **Vault Drawer (Basic)**
   - [x] Placeholder vault folder exists
   - [ ] Create slide-up panel component
   - [ ] Build card list view (title, element, modality)
   - [ ] Implement inline card editor (text only for MVP)
   - [ ] Add save with auto-increment revision
   - [ ] Wire to `useVaultStore` for persistence

**Deliverable:** Fully functional MVP app with working turn loop, card cycling, and camouflage

---

### Phase 3: Polish & Field Testing (Week 5)
**Goal:** Refinement, testing, and first sideloadable APK

#### Tasks:
1. **Visual Polish**
   - [ ] Apply theme tokens consistently across all screens
   - [ ] Ensure 4-second timer visibility and accuracy
   - [ ] Add high-contrast mode toggle
   - [ ] Verify thumb reach for all controls
   - [ ] Test landscape orientation

2. **Edge Case Handling**
   - [ ] Handle empty vault (first launch)
   - [ ] Validate flow has required counters
   - [ ] Prevent timer from drifting over multiple turns
   - [ ] Test backgrounding/foregrounding behavior
   - [ ] Ensure no network calls (audit dependencies)

3. **Testing & Validation**
   - [ ] Unit tests for vault encryption
   - [ ] Unit tests for turn engine timing
   - [ ] Integration tests for full session flow
   - [ ] Manual smoke test on physical Android device
   - [ ] Verify offline operation (airplane mode)

4. **Build & Sideload**
   - [ ] Create survivor release build variant
   - [ ] Generate signed APK with air-gapped keystore
   - [ ] Document sideload installation steps
   - [ ] Create release hash log
   - [ ] Test installation on clean device

**Deliverable:** First field-testable APK with all MVP features

---

## Risk Mitigation

### Technical Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| libsodium integration issues | Medium | High | Prototype encryption in isolation first; have fallback to native crypto |
| Timer drift under load | Low | Medium | Use React Native's precise timing APIs; test on low-end device |
| State loss on app kill | Medium | High | Persist session state on every turn commit |
| Vault corruption | Low | Critical | Implement checksum validation; keep backup of last good state |

### UX Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| 4-second window too short | Medium | High | Make it configurable in vault settings (3-6s range) |
| Camouflage not convincing | High | Medium | Test with neutral observers; iterate skin design |
| Card text too long for quick read | Medium | Medium | Enforce 2-line max; add "quick line" alternate |
| PIN forgotten | Low | Critical | Cannot recover by design; document backup strategy |

---

## Success Metrics (MVP)

### Functional Completeness
- [ ] User can unlock vault with PIN
- [ ] User can select a flow and launch Live Stack
- [ ] Turn timer cycles at 4.0s intervals
- [ ] User can advance through all cards in a flow
- [ ] Heat and flight path update manually
- [ ] Camouflage curtain activates instantly
- [ ] Session state persists across app restarts
- [ ] No network calls detected in traffic analysis

### Performance Targets
- Cold start to Ready Room: < 2 seconds
- PIN unlock: < 500ms
- Timer tick precision: ±50ms
- Camouflage activation: < 200ms
- Vault encryption/decryption: < 1 second

### Security Validation
- Vault data encrypted at rest
- PIN never stored in plaintext
- No analytics or telemetry
- Task switcher shows blank screen when backgrounded
- Panic wipe irreversibly destroys vault

---

## Development Workflow

### Daily Priorities
1. **Morning:** Focus work (vault, turn engine, screens)
2. **Afternoon:** Integration testing and polish
3. **Evening:** Manual device testing and edge cases

### Git Strategy
- Feature branches for each major component
- Commit after each working increment
- Tag releases as `v0.1.0-mvp`, `v0.2.0-field-test`
- Keep detailed commit messages referencing docs

### Testing Cadence
- Unit tests run on every commit (Jest)
- Manual smoke test daily on physical device
- Full integration test before each build
- Field test with trusted user after Phase 3

---

## Post-MVP Roadmap

### Milestone 3: Vault Management (Week 6-8)
- Receipt file viewer and pairing
- Backup import/export to SD/USB
- Duress PIN implementation
- Settings page (haptics, accessibility)

### Milestone 4: Practice Drills (Week 9-10)
- Drill launcher with extended timers
- Scripted opponent responses
- Performance tracking (local only)
- First community-generated card pack

### Milestone 5: Advanced Features (Week 11+)
- Combo detection and highlighting
- Multiple camouflage skins
- Audio cues and haptic feedback
- Custom card creation wizard
- Desktop companion tool (offline)

---

## Open Questions for Team

1. **Timer Configuration:** Should 4-second duration be editable in settings, or locked to match doctrine?
2. **Seed Data Source:** Do we extract cards verbatim from card-compendium doc, or create simplified starter set?
3. **AutoSlack Messaging:** What's the right tone for missed turn prompts—clinical or motivational?
4. **Panic Wipe UX:** Long-press duration (3s? 5s?) and confirmation wording?
5. **Flight Path Calculation:** Manual only, or should we auto-adjust based on card deltas?
6. **Camouflage Content:** Generic flight sim, or something less technical (weather app, recipe browser)?
7. **Card Line Length:** Strict 2-line limit, or allow scrolling for complex counters?
8. **Build Flavors:** Separate "survivor" and "ally" APKs, or single build with optional toggles?

---

## Next Immediate Actions

### This Week (Phase 1 Start)
1. Implement vault key derivation using react-native-libsodium
2. Create encrypt/decrypt helper functions
3. Build `useSessionStore` with turn state
4. Prototype `TurnEngine` with 4-second loop
5. Define starter card JSON schema

### Success Criteria for Phase 1
- Can encrypt/decrypt a JSON vault with PIN
- Timer ticks accurately for 10 consecutive turns
- State stores persist across app restarts
- Unit tests pass for encryption and timing

---

## Resource Links
- **Docs Reference:** `/docs/phase-*` (already reviewed)
- **Tech Stack:** React Native 0.74.3, TypeScript, Zustand, libsodium, styled-components
- **Project Structure:** `/app/src/` (scaffolded with placeholders)
- **Milestone Tracker:** This document + GitHub issues (optional)

---

**Document Status:** Living roadmap—update after each phase completion.  
**Last Updated:** Phase 0 complete (scaffold + dependencies). Ready for Phase 1.
