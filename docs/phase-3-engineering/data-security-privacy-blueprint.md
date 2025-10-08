# Data, Security & Privacy Blueprint

## 1. Purpose
Protect the survivor’s receipts and counter-scripts on a device that never touches the internet. This blueprint favors physical resilience, instant camouflage, and quick destruction over policy theater so the narcissists never get the leverage they need to crash the plane.

## 2. Data Inventory (All Local)
| Store | Contents | Sensitivity | Notes |
| --- | --- | --- | --- |
| `vault/cards/*.json` | Card lines, cues, flow routes | High | Encrypted with libsodium; editable on device |
| `vault/receipts/*` | PDFs, images, audio proof | Critical | Encrypted blobs; filenames hashed |
| `vault/config.json` | PIN hash, settings, skin choice | High | Never leave device; no cloud backup |
| `logs/runtime.log` | Optional debug notes | Medium | Disabled in survivor builds by default |
| `.deckpack` exports | Encrypted tarballs for manual backup | Critical | Copy by USB only; treat like physical evidence |

No consent records, analytics, or cloud mirrors exist. If a survivor wants notes, they write them on paper.

## 3. Threat Model & Assumptions
- **Primary attackers:** Narcissistic relatives, family lawyers, seized device examiners, opportunistic thieves.
- **Capabilities:** Physical access, intimidation, basic digital forensics, screenshots, forced unlock attempts.
- **Defensive posture:** Device stays in airplane mode; survivor controls all updates; app must hide instantly and erase fast.

## 4. Controls by Layer
### 4.1 Access Control
- 6–8 digit PIN required at launch; hashed with Argon2id, 64-bit salt.
- Optional “duress PIN” that opens a decoy vault with harmless cards.
- Auto-lock after 45 seconds of no interaction or upon screen off.
- Backgrounding sets Android FLAG_SECURE and switches to camouflage art.

### 4.2 Encryption & Key Handling
- Master key derived from PIN (Argon2id, 300ms target on Pixel 4 class hardware).
- Key kept in Android Keystore memory slot while app is active; cleared on lock/camouflage.
- Vault data encrypted using XSalsa20-Poly1305; every file gets a unique nonce.
- `.deckpack` exports include key envelope encrypted with one-time backup passphrase supplied on export.

### 4.3 Physical Stealth
- App name/icon: “Flight Ops Trainer.”
- Camouflage curtain reachable from any screen via double-tap on command rail or hardware volume combo.
- Optional “vibration only” feedback so the tool looks like idle game when muted.
- Provides printed cheat sheet for survivors describing how to rapidly uninstall and shred the vault.

### 4.4 Data Destruction
- Panic wipe deletes key material, overwrites vault directories, clears recent app list entry.
- Option to auto-trigger wipe after N failed PIN attempts (default 5).
- Survivor can schedule a “dead man” wipe timer if the phone leaves airplane mode for longer than configured.

### 4.5 Integrity & Tamper Resistance
- APK signed offline; fingerprints documented in README for manual verification.
- Survivor builds disable JavaScript remote debugging and developer menu.
- App verifies its own bundle checksum at boot; if mismatch, it refuses to open vault.
- Vault metadata includes HMAC to ensure card packs weren’t modified outside the app.

## 5. Privacy Stance
- No telemetry, no crash dumps shipped automatically, no analytics toggles.
- All logs are opt-in and plaintext; survivor toggles them on only if debugging with a trusted ally.
- Exporting data requires re-entering PIN and acknowledging on-screen warning about physical risk.

## 6. Operational Guidance for Survivors
1. **Keep the phone offline.** Airplane mode stays on; only toggle off in private to sideload updates.
2. **Back up manually.** Copy `.deckpack` to encrypted SD card, then lock it in a safe place.
3. **Rotate PIN monthly.** The app guides the survivor through the change and re-derives keys.
4. **Review receipts.** Mark them verified in-app after checking the file on a laptop you control.
5. **Practice the wipe gesture.** Muscle-memory counts—you get no second chance when the narc walks in.

## 7. Developer Responsibilities
- Ship release builds from an air-gapped machine when possible.
- Run security unit tests (encryption, wipe) before handing over any APK.
- Maintain threat model document alongside this blueprint and update whenever features change.
- Never embed third-party trackers or crash reporters.
- Provide survivors with SHA256 of release APK and instructions for verifying via desktop.

## 8. High-Risk Scenarios & Responses
| Scenario | Mitigation |
| --- | --- |
| Device confiscated while unlocked | Use quick-lock shortcut (power button) to close vault; timer auto-locks in 1s |
| Forced unlock demand | Survivor enters duress PIN → decoy vault with bland cards; real vault remains encrypted |
| App discovered during search | Camouflage name/icon plus decoy data; README advises uninstalling quickly |
| SD card seized | `.deckpack` encrypted with separate passphrase; resilient even if phone PIN compromised |
| App binary tampered | Checksum validation blocks launch; survivor reinstalls from known-good APK |

## 9. Open Items
- Test Argon2id performance on ultra-low-end devices and tune parameters.
- Decide whether to bundle a tiny log scrubber CLI so survivors can wipe debug logs without reinstalling.
- Explore optional Bluetooth pedal/shortcut for covert panic wipe activation.

## 10. Next Actions
1. Implement duress PIN branch in lock screen module.
2. Measure wipe latency on reference device; optimize filesystem calls until under 3 seconds.
3. Write survivor-facing “Security Quick Card” PDF for printing and inclusion with sideload kit.
4. Script SHA256 verification instructions for Windows, macOS, Linux.
