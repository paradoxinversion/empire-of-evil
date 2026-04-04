# `config/skills.json`

Defines the skills that persons can develop. Skills represent trained abilities, scored 0–100, and are soft-capped by their governing attribute — a skill's effective maximum is the value of its `attributeCap` attribute on that person.

Skills are used as `skillDrivers` in plots, activities, research projects, and citizen actions to determine outcomes and accumulate success scores.

---

## Schema

An array of skill definition objects.

### Skill object

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Unique identifier. Referenced by `skillDrivers` arrays in plots, activities, research, and citizen action configs. Use kebab-case. |
| `attributeCap` | `string` | Yes | The attribute whose value caps this skill. Must match the lowercased `name` of an entry in `personAttributes.json` (e.g., `"intelligence"`, `"combat"`). |

---

## Notes

- Renaming a skill `id` requires updating all `skillDrivers` references in activities, plots, citizen actions, and research projects.
- If an `attributeCap` references an attribute name that doesn't exist in `personAttributes.json`, the engine will surface a validation error at startup.

---

## Example template

```json
[
  { "id": "firearms",     "attributeCap": "combat" },
  { "id": "infiltration", "attributeCap": "agility" },
  { "id": "computing",    "attributeCap": "intelligence" }
]
```
