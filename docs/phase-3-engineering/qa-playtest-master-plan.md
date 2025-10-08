# QA & Field Drill Plan

## 1. Purpose
Guarantee the burner-phone coach never freezes, leaks, or slows the survivor down when the narc circus kicks off. Testing focuses on four things: the turn loop, the vault, camouflage, and the panic wipe so the survivor keeps landing the plane while the family watches their ambush stall out.

## 2. Quality Targets
- **Stay Up:** No crashes, hangs, or blank screens during a four-second cadence.
- **Stay Offline:** App must boot, edit cards, and import packs with radios disabled.
- **Protect Vault:** Encryption, duress PIN, and panic wipe must work every time, sub-three seconds.
- **Keep Flow:** HUD always shows the next card before timer expires; combo reminders fire reliably.

## 3. Test Layers
1. **Unit Tests (pnpm test)**
   - Turn manager transitions (Card → AutoSlack → Camouflage → Resume).
   - Heat adjustments, combo reminders, timer math.
   - Vault key derivation + encrypt/decrypt cycles.

2. **Device Automation (optional but encouraged)**
   - Detox script: unlock → Ready Room → Live Stack → play three cards → trigger camouflage → resume.
   - Android instrumentation test verifying panic wipe clears vault directories.

3. **Manual Smoke (per build)**
   - Performed on reference phone in airplane mode.
   - Checklist covers: PIN change, duress PIN reveal, flow launch, receipt preview, import/export `.deckpack`.

4. **Field Drills (tabletop)**
   - Survivor or ally runs scripted scenario (e.g., “Timeout ambush”) using printed prompt cards.
   - Observer tracks timing, heat adjustments, and notes any screen hesitations.

## 4. Core Test Suites
- **Turn Loop Suite:** ensures four-second timer accuracy (±0.1s), AutoSlack messaging, combo rail updates.
- **Vault Suite:** tests Argon2id parameters, libsodium encrypt/decrypt, duress PIN separation, wipe latency.
- **Camouflage Suite:** double-tap triggers curtain instantly, resume path requires PIN, no flashes of live data.
- **Backup Suite:** export + import `.deckpack`, verify hash before and after to ensure no corruption.
- **Accessibility Suite:** high-contrast palette, reduced motion mode, haptics toggles.

## 5. Bug Severity & Response
| Level | Definition | Action |
| --- | --- | --- |
| **Red** | Crash, data loss, panic wipe failure | Stop release; patch same day |
| **Orange** | Timer drift, vault unlock anomalies, UI blocking flow | Patch before handing to survivors |
| **Yellow** | Visual bugs, copy issues, non-blocking haptics glitch | Schedule for next maintenance build |
| **Green** | Cosmetic only | Log for future polish |

Bugs tracked in a simple shared markdown log (`docs/qa/bug-log.md`); no SaaS trackers.

## 6. Regression Rhythm
- Maintain `docs/qa/regression-checklist.md` with ~20 must-pass steps (PIN change, duress vault, flow swap, import/export, camouflage, panic wipe, heat bar, calm overlay).
- Run full checklist before every survivor release.
- Record run results (pass/fail + notes) in dated markdown file for traceability.

## 7. Field Drill Program
### Drill Types
- **Timeout Gauntlet:** rehearse countering repeated timeout traps; verifies AutoSlack guidance.
- **DARVO Blitz:** ensure combo reminders flash in correct order; check heat adjustments.
- **Receipts Drop:** test quick access to PDFs while timer runs; confirm screen stays steady.
- **Camouflage Crash:** fake relative walks in mid-turn; tester triggers double-tap and re-enters within ten seconds.

### Execution
- Use burner phone + printed scenario cards.
- Timer official measures real 4-second cadence with stopwatch to validate UI timer sync.
- After drill, update card notes immediately to confirm edit flow.

### Safety
- Stop drill if survivor shows distress.
- Observer reminds player to practice panic wipe afterwards to cement muscle memory.

## 8. Tooling (Keep Minimal)
- `pnpm test` for unit suite (Jest).
- Detox scripts stored in `packages/tests/detox` but optional for allies without Mac/CI.
- Manual logs in repo; optional encrypted notes if survivors consent.
- No remote dashboards, no telemetry uploads.

## 9. Release Gate
Before handing an APK to a survivor, confirm:
- [ ] All unit tests pass locally.
- [ ] Manual smoke checklist completed on reference phone (airplane mode).
- [ ] Panic wipe executed successfully once post-build.
- [ ] Regression checklist dated and signed by tester.
- [ ] Hash of APK recorded in build log.

Fail any box → fix or rebuild before delivery.

## 10. Metrics We Actually Watch
- Timer drift (ms difference vs. stopwatch during field drill).
- Panic wipe duration (should be < 3s).
- File corruption incidents on `.deckpack` import (target: zero).
- Survivor confidence score post-drill (1-5 quick self-report).

Forget vanity metrics—if survivors say the tool hesitated, that’s a red flag.

## 11. Roles
- **QA Wrangler:** Maintains checklists, runs manual smoke, signs release gate.
- **Field Drill Lead:** Facilitates tabletop exercises, captures qualitative feedback.
- **Security Checker:** Re-runs vault/panic tests, inspects APK with apktool for unwanted libs.
- **Survivor Coach:** Works with survivors to integrate drill learnings into real decks.

## 12. Open Questions
- Can we automate timer drift checks with a USB camera + script to avoid human stopwatch error?
- Do we need an official method to scrub manual logs before handing phone to another survivor?
- Should we package a “drill mode” that loosens timers for training and logs mistakes automatically?

## 13. Immediate To-Dos
1. Create `docs/qa/regression-checklist.md` template and populate with current steps.
2. Record baseline panic wipe duration on reference phone and document tuning if over 3 seconds.
3. Script Detox scenario covering unlock → card sequence → panic wipe to catch regressions early.
4. Assemble tabletop drill kit (printed prompts, stopwatch, reflection sheet).
