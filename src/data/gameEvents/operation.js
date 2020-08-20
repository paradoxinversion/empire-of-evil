//operation target types
// selected-tile (target is the currently selected tile)

export const operationTypes = {
  move: {
    name: "Move",
    eventType: "move",
    description: "Move squads from the current tile to a new adjacent tile.",
    // no limits for squads/membership
    squadMemberLimit: null,
    maxSquads: null,
    targetTileId: null,
    targetType: "selected-tile"
  },
  scout: {
    name: "Scout",
    eventType: "scout",
    description:
      "Scout the area to get a more accurate count of defenses and possibilities.",
    squadMemberLimit: 4,
    maxSquads: 1,
    targetTileId: null
  },
  attack: {
    name: "Attack",
    eventType: "attack",
    description: "Attack the current tile.",
    squadMemberLimit: null,
    maxSquads: null,
    targetTileId: null,
    targetType: "selected-tile"
  },
  takeover: {
    name: "Take Over",
    eventType: "takeover",
    description: "Secure the current tile for the EVIL empire",
    squadMemberLimit: null,
    maxSquads: null,
    targetTileId: null,
    targetType: "selected-tile"
  }
};

const { getUID } = require("../../utilities");

export class Operation {
  constructor({ squads, gameEventData, targetTileId }) {
    this.id = getUID();
    this.squads = squads;
    this.gameEventData = gameEventData;
    this.targetTileId = targetTileId;
  }
}
