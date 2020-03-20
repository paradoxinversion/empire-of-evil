const operationTypes = {
  move: {
    name: "Move",
    description: "Move squads from the current tile to a new adjacent tile.",
    // no limits for squads/membership
    squadMemberLimit: null,
    maxSquads: null
  },
  scout: {
    name: "Scout",
    description:
      "Scout the area to get a more accurate count of defenses and possibilities.",
    squadMemberLimit: 4,
    maxSquads: 1
  }
};

module.exports = {
  operationTypes
};
