# `effects.json`

Defines effect types — what a named effect **is** (its category, display name, and description). This file does not define behavior; behavior is handled by `effectResolvers` in the engine. Active instances of effects on entities are `EffectInstance` objects stored in `state.effectInstances`.

New effect types that need runtime behavior require a matching resolver in `packages/engine/src/effects/resolvers.ts`. New effects that are purely decorative (displayed on entities but cause no mechanical change) only need an entry here.

---

## Schema

An array of effect definition objects.

### Effect object

| Field         | Type                                                   | Required | Description                                                                                                                                                                         |
| ------------- | ------------------------------------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`          | `string`                                               | Yes      | Unique identifier. Referenced by `EffectInstance.effectId`, tile type `effects` arrays, and any config that applies this effect. Must be unique across all entries. Use kebab-case. |
| `name`        | `string`                                               | Yes      | Display name shown in the UI.                                                                                                                                                       |
| `category`    | `"person"` \| `"zone"` \| `"tile"` \| `"organization"` | Yes      | Which entity type this effect can be applied to. Used for validation and UI grouping.                                                                                               |
| `description` | `string`                                               | Yes      | Player-facing explanation of what the effect means.                                                                                                                                 |

---

## Notes

- `id` values must be globally unique within this file — the engine rejects duplicate IDs at startup.
- The `category` field is informational and used for UI grouping; the engine does not prevent an effect from being applied to the wrong entity type at runtime, so resolvers must validate context themselves.

---

## Example template

```json
[
    {
        "id": "example-effect",
        "name": "Example Effect",
        "category": "person",
        "description": "A description of what this condition means for the affected entity."
    },
    {
        "id": "example-zone-effect",
        "name": "Example Zone Effect",
        "category": "zone",
        "description": "A description of what this condition means for the affected zone."
    }
]
```
