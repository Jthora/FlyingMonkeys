# Ethics & Safeguards Manifesto

## 1. Purpose
Define the ethical boundaries, safety constraints, and operational safeguards governing the Flying Monkeys project so the tool cannot be weaponized against the people it intends to protect.

## 2. Ethical Lens
- **Trauma-Informed:** Assume users are under psychological duress; minimize re-traumatization risks.
- **Do-No-Harm Bias:** Prioritize emotional safety over feature novelty; if uncertain, exclude the feature.
- **Agency Preservation:** Empower players to make informed choices; never coerce or override their judgment.
- **Informed Consent:** Clearly communicate scope, limitations, and risks before granting access.
- **Reciprocity Awareness:** Understand the asymmetric power dynamic between player and hostile actors.

## 3. Safeguard Pillars
1. **Eligibility Controls**
   - Intake questionnaire to confirm the user is the targeted individual, not an aggressor.
   - Manual or semi-automated review for high-risk cases (e.g., conflicting answers, law enforcement involvement).
2. **Language & Content Audits**
   - All card text, prompts, and scripts pass a language sanitization pipeline removing inflammatory or conspiratorial phrasing.
   - Continuous review by subject matter experts (psychologists, legal consultants, survivor advocates).
3. **Psychological Safety Net**
   - In-app prompts remind players to disengage if emotional overload is detected (heat > threshold for consecutive turns).
   - Provide emergency resource list (crisis hotlines, legal aid) in a hidden but accessible module.
4. **Data Protection & Privacy**
   - Sensitive data encrypted at rest; offline-first design reduces cloud exposure.
   - No background data harvesting; players own their logs and can purge instantly.
5. **Misuse Detection & Response**
   - Monitor anonymized telemetry for patterns indicating offensive use (e.g., repeated attempts to craft manipulative scripts).
   - Incident response guide defines steps: warn, suspend, involve legal counsel if necessary.

## 4. Player Qualification Checklist
- Confirms they are the targeted individual, not a family member seeking control.
- Understands the app does not provide mental health diagnosis or legal representation.
- Acknowledges responsibility for local laws/regulations concerning recordings, evidence sharing, or interventions.
- Agrees to respectful use—no doxing, threats, or retaliatory harm.

## 5. Consent Artifacts
- Short-form consent dialog during onboarding with plain-language summary.
- Long-form terms accessible in-app detailing data practices, limitations, emergency disclaimers.
- Change log for consent updates, with in-app alert requiring re-acceptance.

## 6. Language Guardrails
- Maintain a continuously updated lexicon of banned or rephrased keywords (e.g., "conspiracy" → "coordinated narrative").
- Human review for new cards submitted by players before activation.
- Automated alerts if users try to override safe phrasing; offer approved synonyms instead.

## 7. Data Handling Principles
- Default storage on device with optional zero-knowledge cloud backup.
- Encryption keys derived from user-controlled passphrase; no server-side recovery without explicit opt-in.
- Clear retention policy: player can purge data; diagnostic logs pruned automatically after configurable duration.
- Minimize analytics granularity—aggregate metrics rather than raw transcripts.

## 8. Anti-Misuse Protocols
- Vet distribution channels; avoid open app stores until safeguards mature.
- Watermark builds with traceable identifiers to investigate leaks or unauthorized redistribution.
- Establish reporting channel for survivors or allies to flag suspected misuse.
- Collaborate with legal counsel on cease-and-desist procedures if aggressors repurpose the tool.

## 9. Review & Governance
- Form an ethics council (psychologist, survivor advocate, legal consultant, technical lead).
- Quarterly review cadence or accelerated review after major incidents.
- Document decisions, rationale, and dissenting opinions; store in repo under `docs/ethics-log/` (to be created).
- Incorporate player feedback sessions focusing on perceived safety and emotional burden.

## 10. Immediate Action Items
- Draft onboarding consent flow aligned with this manifesto.
- Recruit subject matter experts for language and psychological reviews.
- Prototype misuse detection heuristics before public pilots.
- Create emergency exit UX pattern to switch app into a benign "flight sim" mode if device is seized.

## 11. Future Considerations
- Explore partnerships with legal defense nonprofits for escalated cases.
- Assess need for regional variants reflecting local legal and cultural nuances.
- Evaluate possibilities for third-party audits once the tool moves beyond controlled pilots.
