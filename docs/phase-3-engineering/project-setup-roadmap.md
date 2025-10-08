# Project Setup Roadmap

## 1. Immediate Goals
- Scaffold a **bare React Native (TypeScript)** mobile app targeted at Android 10+ that runs offline by default.
- Establish folder structure and tooling that honors the doctrine: no backend, no telemetry, quick edits, instant camouflage.
- Wire foundational dependencies needed to execute the Phase 2/3 documentation: state store, vault encryption, file system access, navigation, theming.

## 2. Tech Stack Snapshot
| Concern | Package / Approach | Notes |
| --- | --- | --- |
| Framework | `react-native` (bare) + TypeScript | Create under `/app` directory. Enable Hermes. |
| Navigation | `@react-navigation/native` + stack navigator | Four core screens: LockGate, ReadyRoom, LiveStack, Vault. |
| State | `zustand` | Simple stores plus handcrafted turn reducer. |
| Encryption | `react-native-libsodium` | Provides XSalsa20-Poly1305 + Argon2id. |
| File System | `react-native-fs` | Manage `vault/` directories, `.deckpack` import/export. |
| Storage Helpers | Lightweight JSON/YAML schemas (`zod`) | Validate card packs / flow routes. |
| Styling | `styled-components` or lightweight theme helper | Keep UI footprint minimal. |
| Testing | Jest + React Native Testing Library + Detox (later) | Start with unit tests for turn manager and vault driver. |

## 3. Directory Layout (Initial)
```
/app
  /android
  /ios                # optional, exclude from builds until needed
  /metro.config.js
  /package.json
  /tsconfig.json
  /src
    /assets
      /camo
    /components
    /hooks
    /navigation
    /screens
      LockGate/
      ReadyRoom/
      LiveStack/
      Vault/
    /state
    /turn
    /vault
    /utils
  /__tests__
release/
  build_log.md
  signing/
```
- `release/` holds build rituals per DevOps runbook (air-gapped keystore, hash logs).
- `docs/` remains authoritative knowledge base; code should reference schemas defined there.

## 4. Milestone Breakdown
### Milestone 0 – Scaffold & Hardening
1. `npx react-native init FlyingMonkeysApp --template react-native-template-typescript` (inside `/app`).
2. Enable Hermes, configure Android min SDK 29.
3. Add baseline dependencies (`zustand`, `@react-navigation/native`, `react-native-gesture-handler`, `react-native-screens`, `react-native-safe-area-context`, `react-native-fs`, `react-native-libsodium`, `zod`).
4. Set up ESLint + Prettier conforming to TypeScript strict mode.
5. Add base theme + typography tokens matching visual language doc.

### Milestone 1 – Core Infrastructure
1. Implement `vault/` driver: key derivation (Argon2id), encrypt/decrypt JSON file helpers, `.deckpack` import/export stub.
2. Build `turn/` module with 4-second loop, AutoSlack fallback states.
3. Establish global stores (`useSessionStore`, `useVaultStore`).
4. Create navigation scaffold with placeholder screens mirroring wireframes.

### Milestone 2 – HUD & Ready Room MVP
1. Flesh out Ready Room screen: flow selector, pack snapshot, warm-up placeholders.
2. Implement Live Stack skeleton: timer bead, current card, next cards, action shelf, calm overlay.
3. Wire manual heat adjustments and combo reminders.
4. Add camouflage curtain screen + double-tap gesture stub.

### Milestone 3 – Vault Management & Backups
1. Build card editor, receipt pairing, backup import/export flows.
2. Hook up duress PIN + panic wipe (delete vault + keys).
3. Add settings page for haptics, high contrast, reduced motion toggles.

### Milestone 4 – Practice Drills & Field Testing
1. Add drill launcher with extended timers.
2. Integrate stopwatch-driven tests to validate 4-second cadence.
3. Ship first `.deckpack` sample (timeout gauntlet) aligned with card compendium doc.

## 5. Tooling & Automation
- Create `scripts/build-survivor.sh` to wrap Gradle survivorRelease build and hash generation.
- Document sideload ritual in `release/build_log.md` per DevOps runbook.
- Configure Git hooks (Husky) for lint/test on commit.
- Plan Detox pipeline later; initial focus on unit + manual smoke tests as called out in QA plan.

## 6. Risk & Mitigation Notes
- **Encryption Integration:** libsodium setup can be finicky—prototype key derivation in isolation before wiring to UI.
- **Bundle Weight:** Keep dependencies minimal; avoid heavy UI kits.
- **Offline Safety:** Audit generated templates for analytics or network calls; strip them immediately.
- **Timeboxing:** Don’t overbuild placeholder content; focus on offline resilience first.

## 7. Next Actions
1. Initialize bare React Native project under `/app` following Milestone 0 steps.
2. Commit scaffold with README update explaining survivor vs. ally build flavors.
3. Begin vault driver spike with mock data to validate encryption path.
```}