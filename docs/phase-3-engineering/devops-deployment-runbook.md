# DevOps & Deployment Runbook

## 1. Purpose
Provide repeatable procedures for building, testing, releasing, and monitoring the Flying Monkeys application across mobile, web, and desktop platforms while preserving stealth and security constraints.

## 2. Environment Matrix
| Environment | Purpose | Access | Notes |
| --- | --- | --- | --- |
| Local Dev | Feature development | All engineers | Uses mock data; no real receipts |
| Integration | Automated tests & nightly builds | CI only | Ephemeral, seeded with sample decks |
| Staging | Candidate builds for survivor/SME review | Restricted (invites) | No real user data; uses staged content |
| Pilot | Controlled live trials | Approval required (ethics board) | Real user data; enhanced monitoring |
| Production | General release (if ever) | Very restricted | Distribution strategy TBD (likely invite-only) |

## 3. Monorepo Structure (Proposed)
```
/ apps
    /mobile (Expo managed app)
    /web (Next.js or Expo web)
    /desktop (Tauri wrapper)
/ packages
    /core (business logic, turn engine)
    /ui (shared components)
    /cards (card library JSON + types)
    /sanitizer (lexicon + CLI)
    /telemetry (metrics utils)
/tools (scripts, codegen)
/docs (existing documentation)
```

## 4. Build & Test Pipeline
1. **Lint & Type Check** (ESLint, TypeScript).
2. **Sanitization Check** (`yarn sanitize:check` to validate cards/lexicon).
3. **Unit Tests** (Jest) for logic modules.
4. **Turn Engine Tests** (XState model tests, property-based where possible).
5. **Component Tests** (React Testing Library).
6. **End-to-End Tests**
   - Mobile: Detox (Android emulator, iOS simulator).
   - Web: Playwright.
7. **Security Scans** (Semgrep, npm audit, Snyk).
8. **Bundle Size Check** (fail if above thresholds).

CI orchestrated via GitHub Actions (or GitLab CI) with workflows per platform.

## 5. Build Commands (Conceptual)
- Mobile: `expo build:android --profile <env>`, `expo build:ios`.
- Web: `expo export:web` or `next build` if using Next.js shell.
- Desktop: `pnpm tauri build` after web export.

Automation: Consolidate in scripts for local reproducibility (`yarn build:mobile`, etc.).

## 6. Release Workflow
1. Merge to `main` triggers integration build.
2. Tag release candidates (`vX.Y.Z-rcN`); generate build artifacts for mobile (.apk/.ipa), web bundle, desktop binaries.
3. Deploy to staging distribution channels:
   - Mobile: Expo EAS internal distribution (sideload links).
   - Web: Deploy to password-protected static host (e.g., Netlify with basic auth).
   - Desktop: Signed DMG/MSI zipped and shared via secure portal.
4. Run smoke tests + manual QA (checklist).
5. Ethics/security sign-off required for pilot/production release.
6. Promote builds:
   - Mobile: TestFlight/closed track or direct sideload (depending on stealth strategy).
   - Web: Flip staging alias to production if approved.
   - Desktop: Publish to secured download portal with individual watermarked builds.

## 7. Versioning Strategy
- Semantic versioning (MAJOR.MINOR.PATCH).
- Increment MINOR for new card sets or major features; PATCH for bug fixes/security updates.
- Maintain separate content version (card library) to support hot updates without full app release.

## 8. Secrets & Config Management
- Use `.env` variants managed via 1Password or Doppler.
- Store secrets only on CI with environment protection (no secrets in repo).
- For Tauri, ensure environment variables stripped from final binary.
- Mobile config (API keys) stored via Expo secrets; obfuscate where possible.

## 9. Distribution & Stealth Guidelines
- App name/bundle: “Flight Ops Command.”
- Use generic icons for store listings (if any) or avoid public stores by using sideload/test distribution.
- Watermark builds per user to track leaks (embed unique ID in about screen, logs).
- Provide instructions for installing via command line to avoid app store scrutiny.

## 10. Monitoring & Alerting
- Minimal analytics; rely on aggregated metrics if user opts in.
- For pilot builds, enable secure crash reporting (Sentry) with PII scrubbing and manual review.
- Setup alerts for:
  - Build failures
  - Sanitization violations
  - Security scan failures
  - Unexpected increase in crash rates

## 11. Deployment Checklists
### Pre-Release (Staging)
- [ ] Sanitization script passes
- [ ] Encryption smoke test (encrypt/decrypt sample receipts)
- [ ] Camouflage mode works on all platforms
- [ ] Deck compliance meter functioning
- [ ] Accessibility quick audit

### Pilot Release Additional Items
# Sideload Build & Deployment Runbook

## 1. Purpose
Give contributors a step-by-step ritual for producing trustworthy APKs, verifying them offline, and hand-delivering the package to survivors without touching app stores or telemetry services—because every clean build is another flight where the family fails to crash the T.I.’s plane.

## 2. Working Environments
| Label | Description | Notes |
| --- | --- | --- |
| **Dev Bench** | Personal laptop/desktop with Android Studio | Networking allowed but no survivor data |
| **Build Crate** | Offline/air-gapped machine (preferred) | Stores signing keys, produces release APKs |
| **Field Phone** | Target Android device kept in airplane mode | Receives sideloaded builds |
| **Backup Drive** | Encrypted USB/SD for `.deckpack` bundles and APKs | Stored in safe location |

No staging/pilot/prod servers exist. Everything is manual and face-to-face.

## 3. Repository Layout (Lean)
```
/android            # Native project, Gradle build files
/ios (optional)     # Only if a survivor needs iOS build
/app                # React Native shared code
/packages/core      # Turn loop, flow logic
/packages/ui        # HUD components
/packages/vault     # Encryption + storage helpers
/docs               # This playbook + survivor guides
```

## 4. Build Ritual (Release APK)
1. **Pull fresh code** on Dev Bench; ensure tests pass (`pnpm test`).
2. **Copy repo** to the Build Crate via encrypted USB if using an air-gapped box.
3. **Set environment**
   ```bash
   # On Build Crate (bash)
   export NODE_ENV=production
   export SKIP_BUNDLE_ANALYTICS=true
   ```
4. **Install dependencies** (`pnpm install --frozen-lockfile`).
5. **Run hardening scripts**
   - `pnpm lint`
   - `pnpm test:engine`
   - `pnpm test:vault`
   - `pnpm build:assets` (preload camouflage skins)
6. **Assemble release**
   ```bash
   cd android
   ./gradlew clean assembleSurvivorRelease
   ```
7. **Verify output**
   - APK located at `android/app/build/outputs/apk/survivorRelease/*.apk`
   - Check size < 80 MB; ensure Hermes bundle included.
8. **Sign (if not auto-signed)** using offline keystore (`jarsigner` or Gradle signingConfig).
9. **Generate hashes**
   ```bash
   sha256sum FlyingMonkeys-survivorRelease.apk > FlyingMonkeys-survivorRelease.apk.sha256
   ```
10. **Document build** in `docs/releases/BUILD_LOG.md` (date, commit hash, hash of APK, operator initials).

## 5. Sideload Delivery
1. Move APK + `.sha256` file to encrypted USB/SD.
2. Travel to survivor with: sanitized instructions, printed hash, optional spare phone.
3. On survivor laptop (offline), verify hash matches using `sha256sum` or equivalent.
4. Transfer APK to field phone via USB (no cloud drives).
5. On phone: enable developer mode → allow “Install unknown apps” for file manager → install APK.
6. Immediately revoke install permission after success.
7. Walk survivor through first launch, PIN setup, and vault test.

## 6. Update & Rollback Strategy
- Keep the last two signed APKs and hashes on the backup drive.
- If a new build misbehaves, uninstall and reinstall previous version; vault data survives because it lives in app storage—advise survivor to export `.deckpack` before downgrading.
- Record every install in a private ledger (date, phone nickname, build hash) for accountability.

## 7. Emergency Patch Protocol
1. Identify bug or vulnerability.
2. Patch code on Dev Bench, rerun full test suite.
3. Follow build ritual on Build Crate, increment PATCH version in `app.json`/`build.gradle`.
4. Deliver patch in person or via trusted courier with same verification steps.
5. Encourage survivor to practice panic wipe before installing patch in case something goes wrong.

## 8. Build Variants
- `survivorRelease`: Hardened, no dev menu, logs off, FLAG_SECURE on, panic wipe enabled.
- `allyDebug`: Dev menu, verbose logging, screenshots allowed. Never ship to survivors.
- Optional `duressDemo`: Preloaded decoy cards for training; flagged so survivors know it’s fake.

## 9. Asset & Card Updates
- To ship new cards without full rebuild, create `.deckpack` bundle with `pnpm pack:deckpack`.
- Distribute on encrypted media; survivor imports via Vault > Backups > Import.
- Always share updated primer notes alongside deck changes so language stays sharp.

## 10. Tooling & Automation (Minimal)
- Keep lightweight scripts (`tools/release-notes.sh`) to generate change summaries.
- Use `git tag vX.Y.Z-survivor` on the commit used for each build—tags stored locally and pushed only to private repo.
- No SaaS CI/CD; if automation desired, run self-hosted GitHub Actions runner on Build Crate with network unplugged after checkout.

## 11. Roles & Responsibilities
- **Builder:** Runs release ritual, maintains signing keys.
- **Courier:** Delivers packages, verifies hashes with survivor.
- **Security Checker:** Spot-checks APK with tools like `apktool` to ensure no accidental trackers.
- **Documentarian:** Updates `BUILD_LOG.md`, survivor install ledger, and README instructions.

## 12. Open Questions
- Should we script an Android CLI to automate installation for allies who aren’t technical?
- How do we securely retire signing keys if a laptop goes missing?
- Can we pre-provision burner phones with the app for faster distribution?

## 13. Next Steps
1. Create `BUILD_LOG.md` template and commit to repo.
2. Write laminated survivor installation guide (airplane-mode friendly).
3. Test full ritual end-to-end on reference phone twice to time each step.
4. Explore using F-Droid Privileged Extension for silent updates if a trusted fork becomes necessary.
