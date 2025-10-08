# Card Compendium & Counter Language

## 1. Purpose
Centralize the canonical card library and the battlefield phrasing that keeps the targeted individual in command. No outside filters, no tone-policing—each card is written to neutralize a specific hostile move.

## 2. Terminology & Notation
- **Card ID:** Unique slug (e.g., `trap.flight-lock`).
- **Element.Modality:** `Fire.Cardinal`, `Water.Mutable`, etc.
- **Class:** Engagement, Trap, Counter, Receipts, Calm, Spirit, etc.
- **Combo Tags:** Strings referencing compatible sequences (e.g., `combo.triple-stack.lockdown`).
- **Card Line:** Exact words the player delivers aloud.
- **Player Cue:** Private coaching text shown only to player.

## 3. Language Principles
1. **Direct Strike:** Say the line that shuts down their move. Do not soften.
2. **Proof-Backed:** When a card cites evidence, the player must have the receipt ready to flash.
3. **Spiritual/Reverent:** Use faith-based language to corner religious attackers—never apologize for it.
4. **Legal Accuracy:** Quote dates, filings, and clauses exactly to prevent them from dismissing the claim.
5. **Player Authority:** The device owner is the editor. Custom cards can be as sharp as required.

## 4. Card Template
```
- id:
  element:
  modality:
  class:
  force:
  heatImpact: (Low/Medium/High)
  flightDelta: (-5 to +10)
  staminaCost:
  description: (card line)
  playerCue:
  combos:
    enables: []
    requiredBy: []
  counters:
    primary: []
    vulnerableTo: []
  cooldown:
  unlocks:
  revision:
```

## 5. Core Card Library (Initial Set)
### 5.1 Engagement Cards
| ID | Element.Modality | Card Line | Player Cue | Heat | Flight Δ | Counters |
| --- | --- | --- | --- | --- | --- | --- |
| `engage.flight-manifest` | Air.Cardinal | "We’re following my checklist—first up is the timeline." | Establish flight path agenda. | Low | +5 | `trap.timeout` |
| `engage.receipt-brief` | Earth.Cardinal | "I’ve got the receipts printed; we’ll go through them one at a time." | Signal receipts ready; keep pace firm. | Low | +4 | `counter.receipt-flood` |

### 5.2 Trap Cards
| ID | Element.Modality | Description | Player Cue | Heat | Flight Δ | Counters |
| `trap.flight-lock` | Air.Fixed | "Pause. We finish this timeline before touching anything else." | Locks conversation lane; sets up combo. | Medium | +6 | `counter.timeout` |
| `trap.mirror-ask` | Water.Mutable | "Repeat exactly when you say that happened—I’m logging it." | Forces them to restate lie; sets mirror trap. | Low | +3 | `engage.group-pile` |

### 5.3 Counter Cards
| ID | Element.Modality | Description | Player Cue | Heat | Flight Δ | Counters |
| `counter.timeout-shield` | Earth.Fixed | "No timeouts—you’re trying to dodge the point and we’re not moving." | Blocks timeout; must deploy within 2 seconds. | Medium | +2 | `trap.double-timeout` |
| `counter.darvo-invert` | Fire.Mutable | "Nice try flipping this—answer the original question now." | Recognize DARVO; slam them back to topic. | Medium | +5 | `trap.emotional-flood` |

### 5.4 Receipts & Truth Cards
| ID | Element.Modality | Description | Player Cue | Heat | Flight Δ | Counters |
| `truth.gov-ledger` | Earth.Cardinal | "Here’s the probate filing—page 3 proves what I said." | Show verified document; share via receipt vault. | Low | +7 | `counter.receipt-smear` |
| `receipt.timeline-share` | Air.Fixed | "I logged every call with screenshots; we’re reviewing them now." | Force them into factual plane; maintain calm tone. | Medium | +6 | `trap.discredit-source` |

### 5.5 Calm and Spirit Cards
| ID | Element.Modality | Description | Player Cue | Heat | Flight Δ | Counters |
| `calm.breath-anchor` | Water.Fixed | "Pause. I’m steady, and I’ll continue once you stop shouting." | Reduces own heat; cue mirrored breathing. | Low | +1 | `engage.speed-press` |
| `spirit.angel-guard` | Fire.Cardinal | "Angels hear everything—we’re keeping this honest right now." | Spiritual wedge; opponents reluctant to attack. | Low | +4 | `counter.mock-spirit` |

### 5.6 Special & Combo Catalyst Cards
| ID | Element.Modality | Description | Player Cue | Heat | Flight Δ | Counters |
| `combo.lockdown-init` | Air.Cardinal | "Lock it in—facts first, then whatever fantasy you’re trying next." | Enables Lockdown combo when paired with Counter + Truth. | Medium | +2 | `trap.timeout` |
| `combo.triple-calm` | Water.Mutable | "Bring it down. Now you’ll listen while I lay out the sequence." | Chains Calm → Empathy → Intelligence combo. | Low | +3 | `counter.pile-on` |

*Note: Extend tables as library grows; maintain separate JSON/YAML for implementation.*

## 6. Combos & Language Cues
### 6.1 Lockdown Combo (Trap → Counter → Truth)
- **Cards:** `trap.flight-lock` → `counter.darvo-invert` → `truth.gov-ledger`
- **Effect:** Cancels DARVO streak, pushes flight path +12, reduces opponent morale.
- **Spoken Line:** “Lock this point in. Answer it now before you try another stunt.”

### 6.2 Calm Interrupt Intelligence (Calm → Interrupt → Intelligence)
- **Cards:** `calm.breath-anchor` → `counter.interrupt-silence` (future card) → `engage.receipt-brief`
- **Effect:** Shuts down Crocodile Tears; resets heat balance.
- **Spoken Line:** “Stop the tears. I’m dropping the notes that end this right now.”

### 6.3 Spiritual Shield (Spirit → Trap → Truth)
- **Cards:** `spirit.angel-guard` → `trap.mirror-ask` → `truth.gov-ledger`
- **Effect:** Forces religious enforcer to stand down or risk public contradiction.
- **Spoken Line:** “If you’re claiming faith, then stand on truth—here’s the document proving mine.”

## 7. Card Editing Workflow (Offline)
1. **Draft:** Designer or survivor writes the raw line and player cue.
2. **Field Check:** Test line during practice; note whether it stunned the room.
3. **Receipt Link:** Attach supporting evidence if the line references documentation.
4. **Vault Save:** Card stored locally; optional export to encrypted file for backup.
5. **Share (Optional):** Hand-deliver encrypted bundle to trusted allies; never upload.

## 8. Language Notes
- Use “narc” and “psychopath” freely when it undercuts their authority—truth beats politeness.
- Swap in local religious references (guardian angel, Saint Michael, ancestral warrior) as needed.
- Legal lines should cite specific dates, docket numbers, or statutes.
- Replace sarcasm with surgical clarity; ridicule is optional but accuracy is mandatory.

## 9. Localization Considerations
- Maintain localized copies entirely offline; store them as separate card packs.
- Once a pack leaves the device, treat it as compromised—reissue new phrasing if needed.
- Encourage players to build slang variants that feel natural in their family environment.

## 10. Card Management
- **Versioning:** Simple integer bump (`v12`, `v13`) appended to card ID when changing the line.
- **Retire/Replace:** Duplicate the card, update the line, and archive the old one locally.
- **Player Additions:** Custom cards saved instantly; player decides when to deploy.
- **Emergency Swap:** If a line backfires in the field, edit it immediately—no approval required.

## 11. Tooling Support
- In-app editor with quick duplicate/modify buttons.
- Export/import encrypted `.deckpack` files via USB or AirDrop (offline mode only).
- Optional desktop companion (also offline) for bulk editing.

## 12. Open Questions
- Should we ship regional slang packs out of the box or leave them entirely user-generated?
- Do practice drills need auto-speech playback to train delivery cadence?
- What’s the best offline way to trade card packs between trusted allies?

## 13. Next Steps
1. Populate the full 60-card starter deck using this template.
2. Draft hostile combo notes so each card lists the plays it disrupts.
3. Script the practice drills that force rapid-fire use of these lines.
4. Gather field feedback offline and iterate the phrasing that wins.
