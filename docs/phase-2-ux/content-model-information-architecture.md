# Content Model & Information Architecture

## 1. Purpose
Lock in the minimum content structures the Flying Monkeys tool needs to keep the player in command during a hostile “family intervention.” Everything lives offline, under the player’s control, and can be edited in seconds on a burner Android kept in airplane mode so the narcs never grab the yoke and crash the plane.

## 2. Essential Entities
| Entity | Description | Key Fields | Notes |
| --- | --- | --- | --- |
| `Card` | Spoken line + cue the player fires in a turn | id, title, line, cue, element, modality, class, heatCost, flightImpact, counters[], combos[], revision | Text stays raw and unsanitized—only the player edits it. |
| `Card Pack` | Bundle of cards for a scenario or archetype | id, name, purpose, cardIds[], mustHaveCounters[], revision | Stored as plain JSON in the encrypted vault; easy to duplicate and tweak mid-conflict. |
| `Flow Route` | Flow-chart slice that maps three steps ahead | id, entryTrigger, cardSequence[], fallbackCardId, notes | Drives the HUD so the next card is always visible before four seconds expire. |
| `Receipt` | Evidence artifact ready to drop on demand | id, title, filePath, quickLine, trustLevel, lastVerified | Files never leave the device; quickLine is the sentence said while flashing it. |
| `Practice Drill` | Offline rehearsal script | id, trigger, steps[], coachingNotes, repeatCount | Used in prep to burn combos into muscle memory. |
| `Camouflage Skin` | Visual disguise for the HUD | id, label, assetBundlePath, triggerGesture, default | Swaps instantly without hitting the network. |
| `Device Config` | Local settings blob | pinHash, panicActions, autoVaultLockMinutes, lastBackupCode | Only editable on-device; no profiles, no accounts. |

## 3. Metadata Details
### Card
- `line`: exact spoken words; 180 char max for legibility.
- `cue`: private coaching, short imperative (“Flash the probate PDF now”).
- `counters`: card IDs this card neutralizes.
- `combos`: card IDs that chain immediately after.
- `heatCost`: integer -3 to +6 describing how much pressure it applies to the player.
- `flightImpact`: integer -5 to +10 measuring control swing if landed.

### Card Pack
- Minimum viable pack is 24 cards; no hard upper bound.
- `mustHaveCounters` lists opponent traps that cannot go unanswered (e.g., `timeout-card`, `crocodile-tears`).
- `revision` increments even for field edits so the player can roll back manually.

### Flow Route
- `entryTrigger` aligns with the primer language (e.g., “They say you’re paranoid”).
- `cardSequence` carries 3–5 card IDs in the order the player should throw them.
- `fallbackCardId` is the emergency move if the opponent leaves the path.
- `notes` capture reminders like “Never say OK here” or “Prep receipt #4.”

### Receipt
- `filePath` points to the encrypted document stored on the SD card vault.
- `quickLine` is the spoken sentence while revealing it.
- `trustLevel` is a scale player defines (e.g., gov, signed statement, audio).
- `lastVerified` is a date the player updated manually after checking the file.

## 4. Navigation Skeleton
No endless menus—just four anchors that map directly to how the survivor works:
1. **Ready Room** – pick a flow route, confirm the current pack, warm up.
2. **Live Stack** – the real-time HUD with a 4-second loop and next-card rail.
3. **Vault** – cards, receipts, backups, all stored locally.
4. **Camouflage** – drag-down laminate that instantly skins the HUD.

All paths are reachable within two taps from the lock screen. There is no persistent bottom nav during Live Stack to avoid accidental exits.

## 5. Screen-Level Content Maps
### Ready Room
- **Flow Route Picker:** list grouped by trigger phrase (e.g., “Schizophrenic Setup”).
- **Card Pack Snapshot:** show gaps (e.g., “No Counter Timeout prepared”).
- **Warm-Up Tiles:** quick links to breathing drill, scripture line, or mantra.
- **Receipts Check:** toggles showing which PDF/photo is paired with this flow.

### Live Stack
- **Turn Rail:** the current card, plus two upcoming cards from the route.
- **Flight Gauge Strip:** simple three-state indicator (Losing / Holding / Dominating).
- **Heat Monitor:** single bar showing player heat vs. danger threshold.
- **Timeout Watch:** red banner flashing “Never say OK” when a timeout tell is detected manually by the player tapping a warning icon.
- **Receipts Quick-Pull:** one-tap icon that slides up the short list tied to this flow.

### Vault
- Tabs: `Cards`, `Receipts`, `Backups`.
- Cards tab shows packs; tapping opens raw card list for immediate editing.
- Receipts tab displays file names with “open” and “pair to card” shortcuts.
- Backups tab offers export/import of `.deckpack` bundles to SD/USB.

### Camouflage Drawer
- Shows neutral game skin titles (`Flight Trainer`, `Puzzle Run`).
- Long-press to set default; double-tap the status bar anywhere to toggle.

## 6. Content Lifecycle (Player-Controlled Only)
1. **Draft:** Player writes card lines directly on-device.
2. **Field Test:** During practice or live, mark cards that hit or missed.
3. **Refine:** Edit card text instantly; no queue, no approval.
4. **Backup:** Export encrypted `.deckpack` to trusted SD card by hand.
5. **Retire:** Move old copies to `Archive/` folder inside the vault for reference.

There is no remote CMS, moderation queue, or telemetry. All changes are local and manual.

## 7. Search & Filtering
- **Cards:** filter by element, class, or labels like `darvo`, `timeout`, `faith`.
- **Flow Routes:** search by trigger phrase or opponent archetype (“Flying Monkey Swarm”).
- **Receipts:** filter by trust level or file type to prep proof quickly.
Search is instant and offline; indexes reset when the device vault is rebuilt.

## 8. File Layout Inside the Vault
```
vault/
  cards/
    packs/
      default.json
      discardation-v3.json
    archive/
  flows/
    faux-intervention-lockdown.json
  receipts/
    probate-ledger.pdf
    call-log-2024-06.zip
  drills/
    timeout-gauntlet.json
  config/
    device-settings.json
```
Each JSON file is small enough to edit with a text editor if the app fails. Keep a printed list of filenames so the player can rebuild by hand if needed.

## 9. Localization & Tone
- Base language is whatever the player writes; no automated sanitization.
- Provide optional secondary language fields only if the survivor wants them.
- Encourage alternate versions of lines (spiritual, legal, sarcastic) stored as variants within the same card.

## 10. Security Reminders
- Vault encrypts with a single device key; unlocking the app unlocks the vault.
- Never auto-open receipts—require deliberate tap + PIN recheck if configured.
- Panic wipe is optional but disabled by default; the player decides.
- No crash reporting, no analytics, no sync endpoints.

## 11. Open Questions
- Should flow routes support branching mid-turn, or keep it linear for speed?
- Do we ship any starter packs, or is everything blank for safer cover?
- What’s the safest way to remind the player to re-verify receipts monthly without nagging during a live session?

## 12. Next Moves
1. Draft starter JSON schemas for card packs, flow routes, and drills.
2. Prototype Ready Room information density to confirm two taps to launch.
3. Test vault restore from fresh device using only exported `.deckpack` files.
4. Fold primer mantras (“Never say OK”) into default flow route notes and UI badges.
