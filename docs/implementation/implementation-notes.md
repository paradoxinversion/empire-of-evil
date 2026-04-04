# Implementation Notes

## Simulation

The game features heavy simulation.

Each turn may involve processing a lot of data from the get-go. For instance, there could be thousands of People, and each Person that can act will have their day's action simulated.

## Configuration

The game should be as configurable as possible. JSON files will act be configuration sources.

### Attributes & Skills

People have Attributes and Skills defined by configuration. This config allows Attributes and Skills to be renamed without requiring code to be changed. This is done for these benefits:

1. Attributes and Skills can be expanded or reduced without a code change.

2. Users can create modify Attribute and Skill names freely. Note that processes requiring specific Attributes/Skills must subsequently be updated to ensure no breakage occurs.
