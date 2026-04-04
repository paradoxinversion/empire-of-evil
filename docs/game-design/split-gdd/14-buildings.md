# 14. Buildings

## 14.1 Building Types

| Type      | Function                                                     | Who Works There              |
| --------- | ------------------------------------------------------------ | ---------------------------- |
| Residence | Houses citizens and agents; required for population capacity | N/A (occupants, not workers) |
| Office    | Generates Infrastructure; requires Administrator staff       | Administrators               |
| Lab       | Generates Science; requires Scientist staff                  | Scientists                   |
| Bank      | Generates steady Money income                                | Any (tellers, managers)      |
| Hospital  | Heals injured/sick agents and citizens                       | Medical staff                |

## 14.2 Building Attributes

- `name` (string)
- `type` (enum: Residence, Office, Lab, Bank, Hospital)
- `size` (number) — determines occupant/worker capacity
- `zone_id` (string)
- `governing_organization_id` (string)
- `resource_output` (object: type + value) — what resource this building produces and at what rate
- `upkeep_cost` (number) — daily money cost
- `staffing` (Person[]) — current workers
- `construction_complete` (boolean) — false during construction period

## 14.3 Construction & Demolition

Players can build new buildings in controlled zones at a money cost and construction time. Buildings can also be demolished, removing their upkeep but potentially affecting citizen loyalty.

Building type availability may be gated by zone terrain and research unlocks (e.g., advanced lab types requiring specific science projects).
