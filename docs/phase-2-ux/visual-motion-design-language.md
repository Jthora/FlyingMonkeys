# Visual & Motion Design Language

## 1. Purpose
Give the Flying Monkeys tool a look and feel that screams “harmless mobile flight game” to outsiders while feeding the survivor the lines they need with zero friction. Every choice must work offline, render fast on low-end Android hardware, and keep the primer’s hard edge.

## 2. Design Ethos
- **Battlefield Calm:** A cold, confident cockpit vibe that reassures the survivor they’re the pilot.
- **Stealth Camouflage:** Nothing on-screen should hint at narcissistic abuse; it must pass as a quirky flight sim at a glance.
- **Primer Voice:** UI copy echoes the original zine (“Never say OK,” “Lock the flight path”). No corporate polish.
- **One-Handed Control:** Everything readable and tappable while the phone rests on a kitchen table.
- **Flight Path Dominance:** Every visual decision telegraphs that the survivor is landing this plane while the narcissists watch their own ambush fall apart.

## 3. Palette
| Token | Hex | Use |
| --- | --- | --- |
| `sky_night` | `#0C1322` | Background / HUD base |
| `flight_teal` | `#12C9B2` | Primary buttons, timer bead fill |
| `calm_indigo` | `#2E3C64` | Panels, notes, calm overlay |
| `heat_signal` | `#FF5A5F` | Timeout warnings, heat spike |
| `receipts_gold` | `#F2B441` | Evidence highlights |
| `spirit_halo` | `#F6E27A` | Spiritual combo glow |
| `neutral_mist` | `#A2B0C5` | Secondary text |

High-contrast mode swaps backgrounds to `#0B0B0B` and primary text to `#F6F7FB`. Never rely on color alone—pair with glyphs.

## 4. Typography
- **Primary Family:** “Space Grotesk” (fallback `Roboto`) for headings and card lines.
- **Numeric:** “DM Mono” for timers and gauges.
- **Scale:**
  - Flow title: 22sp bold
  - Active card line: 20sp regular
  - Notes / cues: 16sp italic
  - Buttons: 16sp uppercase condensed

Copy stays raw. Use all caps sparingly (“NEVER SAY OK”). Allow glyph fallback for astrology/spiritual icons when offline.

## 5. Iconography
- Line icons with 1.5dp stroke.
- Core set: timer bead, flight gauge, receipt folder, calm wave, camouflage plane.
- Element glyphs: flame ▲, feather △, droplet ●, stone ■.
- Timeout warning icon is a red inverted triangle with the letters “T.O.”

## 6. Card Canvas
- Card background is `calm_indigo` with element-colored strip at top.
- Modality glyph sits in top-right corner.
- Card line uses full width; never truncate words.
- Player cue appears on tap as a slide-up sticky note overlay (no flip animations that feel suspicious).
- Alternative variants slide horizontally with a low-friction pager.

## 7. Motion Principles
- **Fast & Subtle:** Nothing longer than 180ms in the Live Stack; 260ms max elsewhere.
- **Timer Drain:** vertical wipe downward; final second pulses once (no flashing).
- **Combo Callout:** thin teal line arcs between current card and the next card slot.
- **Calm Overlay:** slow radial gradient breathing circle timed to four-count inhale / hold / exhale.
- **Camouflage Transition:** hard cut with a 120ms white flash, followed by immediate display of fake cockpit UI.

All animations must function even if the device throttles to 30fps.

## 8. Audio & Haptics
- Default state is silent except for optional tactile blips.
- Timer vibrates lightly at 2.0s and 3.5s (configurable). Provide tone alternatives for devices without strong haptics.
- Calm overlay can play a low 60 Hz hum to ground the survivor; keep volume < 40%.
- Camouflage mode loops gentle engine noise and occasional radio clicks to sell the disguise.

## 9. Stealth Patterns
- Ready Room background features abstract navigation charts—no text.
- Camouflage curtain mimics an indie flight trainer menu with fake achievements.
- App icon uses a goofy monkey pilot badge; keep all references humorous and deniable.
- When the phone screen previews in multitask view, show only the camouflage art.

## 10. Feedback States
| Event | Visual Feedback |
| --- | --- |
| Card committed | Card panel gives a quick 120ms teal flash |
| Timeout warning | Command rail turns `heat_signal`, big text “NEVER SAY OK” |
| Heat overload | Screen border glows amber until Calm overlay acknowledged |
| Flow success | Flight gauge fills fully and displays “Plane landed” text |
| Panic wipe armed | Background desaturates; prompt shows “This nukes everything. Sure?” |

## 11. Offline Asset Strategy
- Package all fonts, icons, and animations inside the APK; no CDN fetches.
- Provide SVG + PNG fallbacks for each icon so the app can still render if vector support fails on an older device.
- Store camouflage assets in `assets/camo/` with consistent naming so players can swap them manually if needed.
- Ship an optional “blank skin” pack (gray rectangles) for survivors who want zero flair.

## 12. QA Checklist
- Confirm legibility outdoors (sunlight) and indoors (warm lamps).
- Stress test on 5-year-old Android hardware; ensure motion stays under 16ms frame budget.
- Validate camouflage by showing the screen to outsiders—if they guess “card battle coach,” we failed.
- Test reduced motion and high contrast together; the interface must remain coherent.
- Ensure the timer, calm overlay, and camouflage switch still behave when the device is throttled or battery saver is on.

## 13. Open Questions
- Do we preinstall a “spiritual” skin or ship it separately to keep the APK smaller?
- Should the calm overlay include scripture/mantra text by default, or is that better as optional cues per card?
- How obvious should the panic wipe confirmation look—bold red, or neutral to avoid drawing eyes?

## 14. Next Steps
1. Assemble an offline Figma kit with all colors, typography, and icons.
2. Create Lottie-free animation specs (CSS/RN reanimated) so the app runs lean.
3. Prototype the camouflage curtain and sanity-check with survivors and neutral observers.
4. Print the palette + icon cheatsheet for manual reference if the device bricks before an intervention.
