# 21. Victory & Defeat

## 21.1 Victory Conditions

**Military Victory**
The empire controls every zone in the world. Zones rendered permanently uninhabitable are excluded from this count.

**Cultural Victory**
The empire achieves loyalty from a target percentage of the world's total living population, regardless of zone ownership. The exact threshold is a design parameter to be tuned during development. This victory path rewards slow-burn tactics: propaganda, loyalty flipping, Free Internet, and long-term investment in the simulation over pure aggression.

## 21.2 Defeat Conditions

- The Evil Overlord is killed.
- The empire controls zero zones (including cases where the empire has rendered all its own zones uninhabitable).

## 21.3 Epilogue & Score

Upon victory or defeat, the player receives an epilogue screen that reflects _how_ they played:

- A narrative summary of the empire's rise (and fall, if defeat).
- Statistics: zones conquered, citizens converted, plots executed, agents lost, heroes defeated.
- A characterization of the Overlord's legacy — e.g., "You conquered the world through fear and spectacle" vs. "You seduced the world into compliance, one conspiracy theory at a time."

The epilogue should have enough variety that two different victory paths produce meaningfully different endings.

## 21.4 Save Modes

At game start, players select a save mode:

- **Standard** — Traditional save and load. Mistakes can be undone.
- **Ironman** — Autosave only. No reloading. Every decision is permanent.
- **Permadeath** — One life. Defeat ends the run. Start over.

The default mode is Standard.
