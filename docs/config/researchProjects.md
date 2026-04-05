# `researchProjects.json`

Defines research projects available to the empire. Research is conducted by agents assigned to active research tasks. Completing a project consumes science resources and unlocks new plots, activities, or permanent effects.

---

## Schema

An array of research project definition objects.

### Research project object

| Field             | Type       | Required | Description                                                                                                                              |
| ----------------- | ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `name`            | `string`   | Yes      | Display name — typically humorous or euphemistic, written in dry corporate register per the game's tone.                                 |
| `description`     | `string`   | Yes      | Factual description of what the project does and what it unlocks. This is what the player reads to evaluate the investment.              |
| `cost`            | `number`   | Yes      | One-time money expenditure paid when the project is initiated.                                                                           |
| `scienceRequired` | `number`   | Yes      | Amount of science points required to complete the project.                                                                               |
| `completionDays`  | `number`   | Yes      | Base number of days to complete. Reduced by the skill levels of assigned agents.                                                         |
| `skillDrivers`    | `string[]` | Yes      | Skill IDs (from `skills.json`) that contribute to research speed. Agents with higher values in these skills complete the project faster. |
| `prerequisites`   | `string[]` | Yes      | Names of other research projects that must be completed before this one becomes available. Use `[]` for projects with no prerequisites.  |
| `unlocks`         | `object`   | Yes      | What completing this project makes available. See below.                                                                                 |

### `unlocks` object

| Field         | Type       | Description                                                                                                |
| ------------- | ---------- | ---------------------------------------------------------------------------------------------------------- |
| `plotIds`     | `string[]` | Plot IDs (from `plots.json`) that become available to the player.                                          |
| `activityIds` | `string[]` | Activity names or IDs (from `activities.json`) that become available.                                      |
| `effects`     | `string[]` | Effect IDs (from `effects.json`) applied permanently to the empire's governing organization on completion. |

All fields in `unlocks` are optional — omit any that don't apply.

---

## Example template

```json
[
    {
        "name": "Project Designation: Paperclip",
        "description": "Establishes a clandestine logistics network enabling rapid supply distribution across empire zones. Unlocks the Supply Run activity and the Fast Resupply plot.",
        "cost": 50,
        "scienceRequired": 25,
        "completionDays": 20,
        "skillDrivers": ["logistics", "computing"],
        "prerequisites": [],
        "unlocks": {
            "activityIds": ["supply-run"],
            "plotIds": ["fast-resupply"],
            "effects": []
        }
    }
]
```
