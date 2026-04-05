# `personAttributes.json`

Defines the attributes that every `Person` has. Attributes represent innate physical and mental capabilities, scored 0–100. They act as caps on related skills — a skill cannot exceed the value of its governing attribute.

Attributes are intentionally rename-friendly: changing a `name` here renames it everywhere in the UI. However, any skill's `attributeCap` field that references this attribute by its derived ID must be updated to match (see `skills.json`).

---

## Schema

An array of attribute definition objects.

### Attribute object

| Field  | Type     | Required | Description                                                                                                                                                                                   |
| ------ | -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | `string` | Yes      | Display name and the source of the attribute's ID. The ID used in `skills.json`'s `attributeCap` field is the lowercase version of this name (e.g., `"Combat"` → `"combat"`). Must be unique. |

---

## Notes

- The attribute ID is derived from the `name` field by lowercasing. There is no separate `id` field.
- Renaming an attribute requires updating all `attributeCap` references in `skills.json`.
- Adding or removing attributes takes effect immediately for newly generated persons. Existing persons in a saved game will not gain or lose attributes until re-generated.

---

## Example template

```json
[{ "name": "Strength" }, { "name": "Intelligence" }, { "name": "Agility" }]
```
