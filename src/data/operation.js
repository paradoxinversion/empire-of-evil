//operation target types
// selected-tile (target is the currently selected tile)

const operationTypes = {
  move: {
    name: "Move",
    operationType: "move",
    description: "Move squads from the current tile to a new adjacent tile.",
    // no limits for squads/membership
    squadMemberLimit: null,
    maxSquads: null,
    targetTileId: null,
    targetType: "selected-tile"
  },
  scout: {
    name: "Scout",
    operationType: "scout",
    description:
      "Scout the area to get a more accurate count of defenses and possibilities.",
    squadMemberLimit: 4,
    maxSquads: 1,
    targetTileId: null
  }
};

const { getUID } = require("../utilities");

class Operation {
  constructor({ squads, operationType, targetTileId }) {
    this.id = getUID();
    this.squads = squads;
    this.operationType = operationType;
    this.targetTileId = targetTileId;
  }
}

module.exports = {
  Operation,
  operationTypes
};
