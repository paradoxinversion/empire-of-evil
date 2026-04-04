# 24. Post-MVP Features

The following features are planned for post-MVP development. They are described here for planning context and to ensure MVP architecture does not preclude them.

---

## 24.1 Multiplayer

**Format:** All players act on the same shared persistent world with a unified time scale. Players have a limited number of actions (plots, major decisions) they can take per real-world time period. Plots take the in-game time they would take — a week-long operation takes a week of real time to resolve.

A notification system informs players when:

- Their zones are being attacked.
- A queued plot requires attention.
- A significant world event affects them.

**PvP:** Direct zone conflict between human players is supported. Players can attack each other's zones via the same Takeover Zone plot used against CPU orgs.

**Victory:** Multiplayer victory conditions shift toward more nuanced goals — score-based thresholds, faction alliance victory conditions, or first-to-X-percent world control. Exact conditions are TBD for multiplayer design phase.

---

## 24.2 Exile Mechanic

If the Overlord survives the loss of the empire's last zone, the game does not immediately end. Instead, the Overlord and any surviving Inner Circle members enter an exile state:

- The empire has no zones and no income.
- The Overlord and surviving agents can still move, plot, and recruit.
- A comeback requires retaking at least one zone within a defined time window, or the game ends in defeat.

The exile mechanic rewards players who have invested in their Overlord and Inner Circle as individuals rather than just resource nodes.

---

## 24.3 Black Market Economy

A parallel economic layer representing underground commerce, smuggling networks, and criminal enterprises. The empire can:

- Invest in black market infrastructure within zones.
- Use black market channels to bypass standard economic penalties (e.g., fund operations when above the infrastructure cap).
- Be threatened by rival black market operators who are not affiliated with any standard GO.

The black market operates at higher margin but higher risk — exposure can trigger world response events and significant loyalty damage.

---

## 24.4 Additional Victory Conditions

- **Ideological Victory** — Convert a sufficient number of orgs to puppet status through political manipulation.
- **Economic Victory** — Achieve a threshold share of world GDP and trigger economic capitulation.
- **Reputation Victory** — Achieve maximum positive opinion from every surviving org (a near-pacifist run).
