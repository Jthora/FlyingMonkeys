# Game Design Dossier

## 1. Purpose
Document the mechanics, systems, and balancing philosophy for Flying Monkeys. Align designers, engineers, and narrative writers around a single source of truth for gameplay implementation.

## 2. Game Summary
- **Genre:** Solo tactical card battler disguised as a dramatic family intervention simulator.
- **Session Length:** 10–25 minutes.
- **Players:** Single human (targeted individual) versus scripted hostile archetypes drawn from rehearsed family patterns.
- **Core Fantasy:** Maintain Flight Path Control in a hostile environment, exposing manipulation while keeping composure.

## 3. Core Loop
1. **Plan:** Equip deck, review opponent intel, rehearse combos.
2. **Engage:** Play cards in four-second turns, respond to hostile moves.
3. **Stabilize:** Monitor personal delivery, deploy counters, adjust strategy based on flow-chart prompts.
4. **Dominate:** Trigger combos to force disengagement, assert narrative control.
5. **Debrief:** Record field notes, refine deck, rehearse next scenario.

## 4. Turn Structure
- **Turn Timer:** 4 seconds, displayed as a shrinking arc. Extensions possible via specific cards (e.g., Counter Timeout).
- **Phases per Turn:**
  1. **Hostile Action:** opponent plays card or combo.
  2. **Analysis Window:** 1-second highlight of detected tactic (e.g., DARVO alert).
  3. **Player Response:** one primary card plus optional combo attachments (max 3 cards per turn).
  4. **Resolution:** update Flight Path meter, heat levels, combo states, narrative focus.
- **Interrupts:** Certain cards can pre-empt opponent mid-turn (e.g., Interrupt Card) but consume extra stamina resource.

## 5. Resources & Systems
- **Hand:** 5 card slots refresh each turn; top-draw from deck.
- **Deck:** 40 cards; must meet elemental/modality composition rules.
- **Stamina:** Consumed by interrupts, high-impact combos; regenerates slowly when not used.
- **Flight Path Meter:** Gauge from 0–100 representing control; win at ≥ 70 sustained for 3 consecutive turns.
- **Heat Meter:** Dual-track (player vs. opponents); if player heat > opponent heat for 3 turns, on-screen warning triggers.
- **Threat Prompt:** Flow-chart branch hints showing likely enemy moves based on cards already played.

## 6. Card Taxonomy Overview
- **Card Natures:** Fire (spiritual), Air (intellectual), Water (emotional), Earth (physical).
- **Modalities:** Cardinal (attack), Fixed (block), Mutable (parry).
- **Classes:** Engagement, Trap, Counter, Truth, Receipts, Healer (calm), Spirit, Timeout, Combo Catalyst.
- **Forces:** Core, Void, Order, Chaos (future addition).

## 7. Combo System
- **Stack Size:** Up to 3 cards; some combos require exact sequence (e.g., Calm → Interrupt → Intelligence).
- **Triggers:** Combos unlock when prerequisite cards are present in hand and situation matches (e.g., DARVO detected).
- **Effects:** Amplified flight path gains, heat reductions, trap reversals, or immunity windows.
- **Cooldown:** After execution, involved cards enter cooldown (X turns) unless refreshed by specific abilities.

## 8. Opponent Archetypes
| Archetype | Traits | Primary Tactics | Counter Strategy |
| --- | --- | --- | --- |
| Overt Narcissist | Loud, accusatory | DARVO, public shaming | Calm + Receipts combos, mirror traps |
| Covert Narcissist | Passive-aggressive | Victim narrative, silent treatment | Empathy reframing, Timeout counters |
| Flying Monkey | Scripted, reactive | Mainstream fact-check, pile-on | Fact bullet cards, crowd control traps |
| Psychopath | Cold, strategic | Legal threats, precision traps | Legal intelligence cards, multi-turn setups |
| Religious Enforcer | Moral authority | Scripture weaponization | Spiritual angel combos, theological traps |

Opponents swap cards mid-session based on heat and flight path status.

## 9. Difficulty & Progression
- **Difficulty Levels:** Novice, Veteran, Nightmare.
- **Scaling Factors:** Opponent card quality, combo frequency, timeout aggressiveness, trap complexity.
- **Unlocks:** Completing practice scenarios unlocks advanced decks, special cards, and narrative missions.
- **Manual Tuning:** Player can toggle extra hostility packs (e.g., “Legal Blitz”) to mirror their family’s style.

## 10. Balancing Philosophy
- Prioritize counters over power creep: every offensive card must have at least one accessible counter.
- Encourage proactive control: reward early combo setup and trap laying.
- Penalize reckless play: misusing high-heat cards spikes player heat, risking narrative loss.
- Emphasize resilience: players should recover from setbacks with smart resource management.

## 11. Stealth Layer
- **Aesthetic Cover:** UI styled as a futuristic card battler with lore text referencing “Flight Ops.”
- **Camouflage Mode:** Instant toggle converts screen to benign flight simulator dashboard.
- **Lore Achievements:** Non-threatening labels (e.g., “Calm Pilot,” “Truth Navigator”) to reinforce the cover story.

## 12. Practice & Simulation Modes
- **Scenario Builder:** Customize opponent mix, opening tactics, time pressure.
- **Turn Replay:** Step-through playback with offline commentary on alternative plays (no network).
- **Solo Coach Mode:** Optional scripted tips that repeat the doctrine; no adaptive AI or external data.

## 13. Edge Cases & Fail States
- **Triple Stack Highjack:** If opponent completes uncountered triple stack, flight path drops sharply; auto-alert.
- **Device Loss:** App switches to neutral screen; auto-lock requires PIN.
- **No Signal:** App assumes zero connectivity; all assets bundled locally.
- **Player Panic:** If heat spikes beyond threshold, mandatory Calm Card prompt.

## 14. Content Update Cadence
- Manual card pack releases distributed via encrypted sideload packages.
- Emergency hotfixes triggered by new field intel (e.g., fresh legal tactic).
- Player-driven tuning: custom cards can override defaults locally.

## 15. Open Design Questions
- Should there be a stamina-like resource limiting constant trap usage?
- How to represent flying monkey group actions visually without overwhelming UI?
- What are the narrative rewards for long-term mastery (e.g., storyline arcs)?
- How far can we push stealth before impairing at-a-glance readability?

## 16. Next Steps
1. Prototype turn engine with minimal UI.
2. Build card data schema and combo validator.
3. Conduct playtests with scripted scenarios to validate pacing.
4. Iterate on archetype behaviors using state machines.
5. Record field discoveries and fold them into manual updates—no telemetry integration.
