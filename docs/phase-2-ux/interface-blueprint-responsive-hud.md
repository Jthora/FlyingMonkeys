# Interface Blueprint & Responsive HUD Specs

## 1. Purpose
Design the bare-minimum interface that lets the targeted individual cycle cards within four seconds, keep receipts at their fingertips, and vanish into camouflage instantly. The reference device is a thrift-store Android phone in airplane mode; everything else is secondary because the only mission is to keep flight-path control and stop the family from crashing the plane.

## 2. Core Screen Stack
1. **Lock & Vault Gate** – PIN entry, panic wipe option, quick camouflage toggle.
2. **Ready Room** – choose flow route, confirm card pack, run a 30-second warm-up.
3. **Live Stack HUD** – single-loop battle screen built for portrait phones.
4. **Vault Drawer** – edit cards, pair receipts, export backups.
5. **Camouflage Curtain** – instant cover skin always reachable from status bar.

No web shell, no desktop layout, no analytics dashboards. Tablet support simply scales the portrait layout; landscape rotates the Live Stack but keeps the same structure.

## 3. Layout Rules (Mobile-First)
- Base grid: 3 flexible rows stacked vertically.
  1. **Command Rail** (top, 72dp): timer bead, flight gauge pill, panic toggle.
  2. **Route Window** (middle, expandable): active card and two upcoming slots.
  3. **Action Shelf** (bottom, 160dp): manual buttons for receipts, combos, calm, and quick edit.
- Margins: 16dp outer, 12dp between cards.
- Type scales: headline 20sp bold, card line 18sp regular, cues 14sp italic.

### Landscape Adjustment
- Command Rail docks left; Route Window center; Action Shelf right.
- Timer bead enlarges to 64dp to stay visible while the device lies flat on a table.

## 4. Live Stack HUD Anatomy
```
┌──────────────────────────────────────────────┐
│ Timer ● 03.6s  |  Flight Gauge ▮▮▯  |  ⚠︎ Cam │
├──────────────────────────────────────────────┤
│ CURRENT CARD                                 │
│ “Lock this point in. Answer it now.”         │
│ Cue: Flash probate file #2.                  │
├───────────────┬──────────────────────────────┤
│ NEXT UP       │ HOLD CARD                    │
│ “Mirror the…” │ “Timeout shield…”            │
├──────────────────────────────────────────────┤
│ Receipts  Combos  Calm  Notes  Edit          │
└──────────────────────────────────────────────┘
```

### Regions & Behavior
- **Timer Bead:** vertical pill draining top-to-bottom; turns red at 1.5 seconds. Long-press to pause only in practice mode.
- **Flight Gauge:** three-light indicator (Losing / Holding / Dominating). Tappable to show the primer reminder “Never say OK.”
- **Camouflage Toggle:** single icon; double-tap anywhere on the Command Rail to slam the curtain.
- **Current Card Panel:** card text fills the width; swiping left surfaces alternative variants (legal, spiritual, sarcasm) if they exist.
- **Next Up Column:** supplies the next two cards from the flow route; tapping promotes a lower card if the player needs to improvise.
- **Action Shelf Buttons:**
  - `Receipts` slides up the paired file list with the quick lines.
  - `Combos` flashes the primer-defined combo reminder (e.g., “Trap → Counter → Truth”).
  - `Calm` instantly loads a grounding line and slow breathing count when the player feels heat spiking.
  - `Notes` shows flow notes like “Never say OK.”
  - `Edit` opens a modal to tweak the card text mid-session; changes autosave.

## 5. Ready Room Layout
- Top banner: “Pick your flow” with search for trigger phrases.
- Flow tiles show trigger, first card, and receipt checklist status (green/red).
- Card pack summary below with count of counters and traps; missing essentials glow red.
- Warm-up carousel: `Breath`, `Angel line`, `Legal proof`—tap plays 30-second countdown or displays the ready quote.
- “Launch Live Stack” button only activates when flow + pack are selected.

## 6. Vault Drawer
- Slide-up panel accessible from Ready Room or Live Stack pause.
- Tabs across the top: `Cards`, `Receipts`, `Backups`.
- `Cards` shows list of packs; tapping a card opens inline editor with element/modality toggles and a big text box.
- `Receipts` shows file names plus “preview” (opens local viewer) and “pair to card.”
- `Backups` has two buttons: “Export `.deckpack`” and “Import from SD.” Both prompt for PIN again before acting.

## 7. Camouflage Curtain
- Full-screen neutral interface (e.g., “Flight Trainer 2.0”).
- Displays fake telemetry loops unrelated to real data.
- A thin hidden tab at the bottom slides up to return; requires PIN if more than 5 minutes passed.
- Optional loudness slider to change ambient engine hum for cover.

## 8. Interaction Essentials
- **Tap Once to Play:** selecting the current card is a single tap; no double-confirmation to avoid hesitation.
- **Swipe Down to Cancel:** if the player regrets a card before it fires, a downward swipe resets the slot.
- **Hold Receipts Button:** launches the designated PDF viewer in split overlay; release to close.
- **Quick Edit:** text field auto-highlights last sentence so the survivor can patch lines fast.
- **Timer Buzz:** subtle vibration at 2 seconds to remind the player to finish the line.

## 9. Accessibility & Grounding
- Minimum type size 16sp; allow pinch-to-zoom in Live Stack.
- Haptics toggle in Device Config for those who share the phone.
- “Calm overlay” pushes a translucent breathing circle over the screen and dims everything else for three breaths.
- Colorblind mode swaps element colors for unique glyphs.

## 10. Safety Hooks
- Panic wipe (optional) lives behind a long-press combo on the Command Rail.
- When the app is backgrounded, the Live Stack auto-locks and shows nothing in the task switcher.
- No toast notifications or overlays from other apps are allowed; request “display over other apps” permission solely to block interruptions.
- Every critical control is reachable with one hand while the phone is on a table.

## 11. Open Questions
- Do we include a miniature flow-chart visual during Live Stack, or is text faster under stress?
- Should “Never say OK” be a persistent badge on all screens or just Live Stack?
- How many alternative card variants can we surface before it becomes noise?
- Is a low-power “always on” glance screen worth the battery hit for quick prep?

## 12. Next Steps
1. Build a rough Figma portrait prototype focused on thumb reach.
2. Test four-second loop with real survivors—time the motions.
3. Validate camouflage curtain realism with neutral observers.
4. Confirm the UI still reads like a harmless game if someone peeks over the shoulder.
