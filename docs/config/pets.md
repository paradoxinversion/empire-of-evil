# `pets.json`

Defines pet types available to the Evil Overlord. The Overlord's pet is a unique narrative and mechanical fixture — it has special actions unavailable to other persons and contributes to the empire's identity and tone.

---

## Schema

An array of pet type definition objects.

### Pet type object

| Field            | Type          | Required | Description                                                                                       |
| ---------------- | ------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `id`             | `string`      | Yes      | Unique identifier. Referenced when assigning a pet to the Overlord at game start. Use kebab-case. |
| `name`           | `string`      | Yes      | Display name (e.g., `"White Persian Cat"`, `"Giant Iguana"`).                                     |
| `description`    | `string`      | Yes      | Flavor text. Sets the tone for what owning this pet means.                                        |
| `effects`        | `string[]`    | No       | Effect IDs (from `effects.json`) permanently applied to the Overlord while this pet is alive.     |
| `specialActions` | `PetAction[]` | No       | Unique actions the pet can take, separate from standard citizen actions. See below.               |

### `PetAction` object

| Field           | Type                  | Required | Description                                                  |
| --------------- | --------------------- | -------- | ------------------------------------------------------------ |
| `id`            | `string`              | Yes      | Unique action identifier.                                    |
| `name`          | `string`              | Yes      | Display name shown in the event log when the action fires.   |
| `description`   | `string`              | Yes      | What the action does.                                        |
| `triggerChance` | `number`              | Yes      | Probability the action fires on any given day (`0.0`–`1.0`). |
| `effects`       | `EffectDeclaration[]` | Yes      | Effects applied when the action fires.                       |

### `EffectDeclaration` object

See [activities.md](./activities.md#effectdeclaration-object) for the full field reference.

---

## Example template

```json
[
    {
        "id": "white-persian-cat",
        "name": "White Persian Cat",
        "description": "A silky, imperious animal that sits on your lap during briefings and causes subordinates to assume you are more dangerous than you are.",
        "effects": ["inspired"],
        "specialActions": [
            {
                "id": "cat-intimidates-visitor",
                "name": "Stares Down Visitor",
                "description": "The cat fixes a visiting dignitary with a withering gaze, subtly shifting the power dynamic in your favor.",
                "triggerChance": 0.05,
                "effects": [
                    {
                        "type": "increase_loyalty",
                        "chance": 1.0,
                        "parameters": {
                            "target": "random_agent",
                            "minIncrease": 1,
                            "maxIncrease": 3
                        }
                    }
                ]
            }
        ]
    }
]
```
