# Task Flows & Statecharts

## 1. Purpose
Document the tight set of flows that keep the survivor focused on cards, receipts, and camouflage without any network dependencies or analytics noise. The entire state chart must be simple enough to rehearse on paper so the survivor keeps calm hands on the controls and never lets the family crash the plane.

## 2. Primary Tasks (Real Life First)
1. **Unlock & Disguise** – get through the PIN, pick or confirm the camouflage skin, and reach the Ready Room in under five seconds.
2. **Stack Prep** – choose the correct flow route, verify the card pack has the required counters, and spot-check receipts.
3. **Live Stack Loop** – cycle through four-second turns, deliver the line, and queue the next card while watching heat.
4. **Camouflage Bail** – slam the curtain if a narc walks behind you, then re-enter safely.
5. **Quick Edit & Archive** – patch a line after the clash and export a backup to SD/USB.
6. **Practice Drills** – run a scripted gauntlet to burn combos into muscle memory.

## 3. High-Level Flow (Text)
```
[Cold Device]
  ↓
[Lock Screen]
  ├─(fail PIN)→[Lockout Timer]
  └─(valid PIN)
        ↓
      [Ready Room]
        ├─> [Flow Picker]
        ├─> [Card Pack Check]
        ├─> [Warm-Up]
        ├─> [Vault Drawer]
        └─> [Enter Live Stack]
                ↓
            [Turn Loop]
                ├─> [Camouflage Curtain]
                ├─> [Quick Edit]
                └─> [Exit → Ready Room]
```

There is no separate debrief screen; journaling is manual if the survivor wants it.

## 4. Detailed Flows
### 4.1 Unlock & Disguise
1. Launch app → PIN keypad displays.
2. Enter PIN (four digits minimum, six recommended).
3. Optional: tap camouflage dropdown to swap skins before landing in Ready Room.
4. Ready Room loads the last-used flow route by default.

**Edge Cases**
- Three failed attempts invoke a 60-second lockout.
- Holding the command rail for five seconds triggers an optional “panic wipe” confirmation.

### 4.2 Stack Prep
1. Tap flow tile → flow details panel slides up.
2. Confirm the three core cards visible in the panel (entry, trap, counter).
3. If any required counters are missing, a red banner says “Prep counter for Timeout / Crocodile Tears / etc.”
4. Hit “Pair Receipts” to preview evidence; long-press marks it as verified today.
5. Optional warm-up: breathing timer or mantra flashcard.
6. Tap “Launch Live Stack.”

### 4.3 Live Stack Loop
1. HUD displays current card with timer automatically starting at 4.0 seconds.
2. Player taps the card when they speak it aloud; timer resets to 4.0 and advances to the next card.
3. Upcoming card slots roll forward. Player can drag a different card into CURRENT if they need to improvise.
4. Heat meter bumps up/down manually when the player taps “+Heat” or “-Heat” (honor system for self-awareness).
5. Receipts, Calm, and Notes buttons remain one tap away.
6. Loop continues until the player presses “End Run” or the conversation ends naturally.

**Special States**
- **Timeout Warning:** player taps the “Timeout Tell” icon; HUD flashes “Never say OK” and highlights the counter card.
- **Heat Check:** if the heat meter hits max, the Calm overlay auto-appears until acknowledged.
- **Quick Edit:** tap “Edit” to adjust the current card text; timer pauses while editing and resumes once the modal closes.

### 4.4 Camouflage Bail
1. Double-tap the Command Rail or press the hardware volume combo.
2. Camouflage curtain replaces the HUD instantly.
3. Live stack timer pauses; current state encrypted to memory.
4. To return, swipe up on the hidden tab → enter PIN → HUD resumes exactly where it paused.

Constraints:
- Curtain times out after 10 minutes to avoid leaving the HUD exposed.
- Player can optionally configure the curtain to auto-switch to a fake mini-game requiring occasional taps to look legit.

### 4.5 Quick Edit & Archive
1. After ending a session, tap the Vault Drawer.
2. Cards tab lists recently used cards at the top with edit timestamps.
3. Editing a card auto-increments its revision and stores the prior version in `archive/`.
4. “Export pack” prompts the user to select a destination (SD/USB) and requires PIN re-entry before writing.

### 4.6 Practice Drills
1. From Ready Room, tap “Drills.”
2. Pick a drill (e.g., “Timeout Gauntlet 3×”).
3. Timer extends to 6 seconds, and prompts include coaching cues.
4. On completion, the app offers to mark drill as done in a simple checklist—no analytics or scoring.

## 5. Turn Loop State Diagram
```
State: AwaitTurn
  → on timer_tick (3.0s) → FlashWarning
  → on card_spoken → CommitCard
  → on panic → Camouflage

State: FlashWarning
  → displays "Never say OK" + highlight counter
  → on timer_tick (4.0s) → AutoSlack

State: CommitCard
  → log card id locally (in-memory only)
  → rotate flow route
  → on end_run → Exit
  → else → AwaitTurn

State: AutoSlack
  → show "Missed window" message
  → prompt to pick emergency card
  → transition → AwaitTurn

State: Camouflage
  → freeze state
  → on resume → previous state
  → on timeout → Exit

State: Exit
  → Option to open Vault or relaunch Ready Room
```

No telemetry logging, no remote syncing. A lightweight in-memory list helps with immediate undo (one-step only) but is not persisted unless the player exports.

## 6. Vault Drawer Statechart
```
State: Closed
  → on swipe_up → CardsView

State: CardsView
  → list packs and recent cards
  → on select_card → CardEdit
  → on select_tab(receipts) → ReceiptsView
  → on select_tab(backups) → BackupView

State: CardEdit
  → text box + element/modality toggles
  → on save → CardsView (with revision bump)
  → on cancel → CardsView

State: ReceiptsView
  → file list
  → on open → ExternalViewer (within sandbox)
  → on pair → CardsView

State: BackupView
  → buttons for export/import
  → on export → PINCheck → SuccessToast
  → on import → PINCheck → CardsView
```

## 7. Error & Guardrail Handling
- **PIN Fails:** enforce lockout and optional wipe; never hint at the correct digits.
- **Missing Counter:** Ready Room blocks Live Stack launch until the player acknowledges the gap.
- **Timer Missed:** show AutoSlack state, but never auto-play a card; the player must choose.
- **Vault Conflict:** when importing a pack with same ID, prompt to keep both or overwrite.
- **Low Storage:** warn the user; suggest deleting archived packs manually.

## 8. Accessibility Modes
- **High Contrast:** toggles brighter color pairs and thicker outlines.
- **Reduced Motion:** fades replace slide animations; timer pulse becomes solid color shift.
- **Audio Prompts:** optional soft tone at 2 seconds and a deeper tone at 3.5 seconds.

## 9. Open Questions
- Should AutoSlack let the player rewind one card, or does that encourage hesitation?
- Does the Ready Room need a written checklist so the survivor can scan prep steps in three seconds?
- How many practice drills should ship by default before it feels incriminating if discovered?

## 10. Next Steps
1. Convert the state diagrams to Mermaid for dev handoff.
2. Run tabletop drills with printed cards to pressure-test the flow.
3. Prototype the timer and AutoSlack states in React Native to validate responsiveness offline.
4. Revisit AutoSlack messaging with a trauma-informed advisor to ensure it motivates without shaming.
