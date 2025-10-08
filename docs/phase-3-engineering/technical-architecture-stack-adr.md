# Technical Architecture & Stack ADR

## 1. Purpose
Freeze the engineering approach for building a burner-phone coaching tool that lives entirely offline, survives faux interventions, and can be reinstalled from an SD card with zero server calls—all so the survivor can keep the flight path locked and deny the family their crash-and-burn fantasy.

## 2. Non-Negotiable Constraints
- Runs on a sideloaded Android handset kept in airplane mode (Android 10+). Optional iOS build only if a survivor requests it and can jailbreak/test safely.
- No backend, no telemetry, no remote feature flags. Every byte ships inside the APK or in manually copied vault bundles.
- Launch-to-card time under four seconds even on mid-range hardware.
- Survivors can edit any text locally without cross-device sync.

## 3. Platform & Stack Snapshot
- **Framework:** React Native (bare workflow, TypeScript). Bare allows direct control over native modules for encryption and filesystem.
- **State:** Zustand for app-wide state, with a single handcrafted turn-loop reducer (no heavyweight state machine libs).
- **Navigation:** React Navigation stack; only four primary routes (Lock, ReadyRoom, LiveStack, Vault).
- **UI Kit:** Minimal custom components; rely on React Native primitives to keep APK slim.
- **Build System:** Gradle/Android Studio project checked in; no Expo/OTA updates to avoid accidental network calls.

## 4. Storage & Filesystems
- **Config & Cards:** JSON files stored under `files/vault/cards/` encrypted with libsodium (XSalsa20-Poly1305).
- **Receipts:** Binary files stored alongside cards; filenames hashed, metadata kept in `vault/index.json`.
- **Key Material:** Derived from user PIN via Argon2id; cached in Android Keystore while app is unlocked.
- **Backups:** `.deckpack` tarballs containing encrypted cards + receipts; copied manually via USB/SD.

## 5. Module Map (Text)
```
App Shell
  ├─ Lock Gate (PIN entry, panic wipe)
  ├─ Ready Room (flow picker, pack check, warm-up)
  ├─ Live Stack (turn loop, timer, quick actions)
  └─ Vault Drawer (card editor, receipts, backups)

Core Engine
  ├─ Turn Manager (4s cadence, AutoSlack fallback)
  ├─ Flow Route Resolver (next card rail)
  ├─ Heat Tracker (manual adjustments)
  └─ Combo Reminder Service (primer mantras)

Storage Layer
  ├─ Vault Driver (libsodium, Argon2id)
  ├─ JSON Pack Loader (schema validation with Zod)
  ├─ Receipt Mount (opens files via RNFS)
  └─ Backup Exporter (tarball/zip writer)

Camouflage Layer
  ├─ Skin Switcher
  ├─ Decoy Telemetry Renderer (fake gauges)
  └─ Panic Hooks (clear RAM, hide previews)
```

## 6. Architecture Decisions (ADR Summaries)
### ADR-001: Target Android First
- **Decision:** Prioritize Android bare React Native build; treat other platforms as forked experiments.
- **Why:** Survivors already pocket thrifted Androids; sideloading is trivial; Apple notarization is hostile to stealth.
- **Impact:** CI/CD stays simple; more effort on testing across Android OEM skins.

### ADR-002: Bare Workflow over Expo
- **Decision:** Use bare RN to safely bundle libsodium, Argon2id, and filesystem hooks.
- **Why:** Expo managed workflow blocks custom native crypto; OTA updates risk network leaks.
- **Impact:** Engineers manage native project files but gain full control.

### ADR-003: No Backend Ever
- **Decision:** Ship all card content and flows in the APK or offline bundles.
- **Why:** Primer demands airplane mode; any network request is a liability.
- **Impact:** Update experience is manual (USB/SD). Architecture favors local-first design.

### ADR-004: Simple Turn Engine
- **Decision:** Implement turn logic with plain TypeScript functions instead of XState.
- **Why:** Faster mental model, easier to audit under stress, no extra dependency weight.
- **Impact:** Developers write thorough unit tests and keep state transitions explicit.

### ADR-005: Libsodium Vault
- **Decision:** Use `react-native-libsodium` for encryption.
- **Why:** Battle-tested primitives, small footprint, no need to roll our own crypto.
- **Impact:** Requires native setup but keeps encryption consistent across Android/iOS.

## 7. Inter-Module Communication
- Event flow is unidirectional: Live Stack dispatches actions → Turn Manager updates state → UI re-renders.
- Vault writes emit `vaultChanged` events; Ready Room listens to refresh pack summaries.
- No global event bus or telemetry service; logs stay in-memory unless the survivor exports them manually.

## 8. Build Artifacts & Packaging
- Default build flavor `survivorRelease` strips dev tools, disables remote debugging, preloads camouflage assets.
- Secondary flavor `allyDebug` keeps RN dev menu for internal contributors; never share externally.
- Optional `desktopShell` experiment uses Capacitor + Webview packaged with Tauri, but lives in a separate branch until proven safe.

## 9. Performance Practices
- Preload the current flow route and next two cards into memory when entering Live Stack.
- Keep JavaScript bundle < 1.2 MB by pruning unused libraries.
- Use Hermes engine for smaller footprint and faster startup.
- Lazy load receipt previews only when the drawer opens.

## 10. Security Hooks in Architecture
- Panic wipe triggers `VaultDriver::destroyAll()` which deletes keys and overwrites data directories.
- Camouflage curtain runs on a separate RN screen to ensure sensitive components unmount instantly.
- Disable screenshot capture via Android FLAG_SECURE by default (option to relax for practice mode).

## 11. Open Topics
- Validate whether iOS sideloading (AltStore) is worth supporting or increases risk.
- Confirm Argon2id performance on low-end devices; fallback to scrypt if needed.
- Determine if we should ship a separate lightweight CLI (Node/Rust) for editing `.deckpack` bundles on desktop.

## 12. Immediate Engineering Tasks
1. Scaffold bare React Native app with Hermes + libsodium + RNFS.
2. Build prototype turn loop with manual 4-second timer and AutoSlack fallback.
3. Wire VaultDriver to load/save card packs and receipts from encrypted JSON blobs.
4. Implement camouflage curtain screen and panic wipe flow.
5. Document manual build + sideload steps in the README for future allies.
