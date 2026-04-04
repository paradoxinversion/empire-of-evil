# `config/evilTiers.json`

Defines the EVIL tier thresholds that segment the `empire.evil.perceived` value (0–100) into named bands. When the empire's perceived EVIL crosses a tier boundary, an interrupt event fires and the world's response profile escalates.

Tier transitions are always acknowledgment-only interrupts — the player cannot miss them.

---

## Schema

An array of EVIL tier objects, ordered from lowest to highest `minPerceived`. The tiers must cover the full 0–100 range with no gaps or overlaps.

### EVIL tier object

| Field | Type | Required | Description |
|---|---|---|---|
| `minPerceived` | `number` | Yes | Minimum perceived EVIL value (inclusive) for this tier. |
| `maxPerceived` | `number` | Yes | Maximum perceived EVIL value (inclusive) for this tier. |
| `name` | `string` | Yes | Display name of the tier shown to the player (e.g., `"Menace"`, `"Supervillain"`). |
| `worldResponseProfile` | `string` | Yes | ID referencing a behavior profile in `cpuBehaviors.json`. Controls how aggressively CPU governing organizations respond to the empire at this tier. |
| `playerFacingDescription` | `string` | No | Narrative text shown in the tier transition interrupt event. Describes what this escalation means in-world. |

---

## Notes

- Tier boundaries must be contiguous and cover 0–100 exactly. The engine validates this at startup.
- `worldResponseProfile` must match an ID in `cpuBehaviors.json`.
- The `name` field is purely cosmetic — logic is driven by the `worldResponseProfile` reference.

---

## Example template

```json
[
  {
    "minPerceived": 0,
    "maxPerceived": 19,
    "name": "Nuisance",
    "worldResponseProfile": "none",
    "playerFacingDescription": "Your activities have drawn some attention, but the world largely dismisses you as a minor irritant."
  },
  {
    "minPerceived": 20,
    "maxPerceived": 39,
    "name": "Irritant",
    "worldResponseProfile": "low",
    "playerFacingDescription": "Intelligence agencies have opened files on your organization. Expect increased scrutiny."
  }
]
```
