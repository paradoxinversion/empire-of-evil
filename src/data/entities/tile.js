const { getUID } = require("../../utilities");
const {
  getRandomIntInclusive
} = require("../../commonUtilities/commonUtilities");
const { getMapDimensions } = require("../../commonUtilities/commonUtilities");

/**
 * Represents a tile on the world map
 */
class Tile {
  constructor({ x, y, land = true }) {
    this.id = getUID();
    this.x = x;
    this.y = y;
    this.land = land;
    this.tileWater; // for map gen
    this.waterInitialized = false;
    this.nationId = null;
  }

  setNationId(id) {
    this.nationId = id;
    return this;
  }

  getNeighbors(gameMap) {
    const { width, height } = getMapDimensions(gameMap);
    const neighbors = {
      north: this.y !== 0 ? gameMap[this.y - 1][this.x] : null,
      east: this.x < width - 1 ? gameMap[this.y][this.x + 1] : null,
      south: this.y < height - 1 ? gameMap[this.y + 1][this.x] : null,
      west: this.x !== 0 ? gameMap[this.y][this.x - 1] : null
    };
    return neighbors;
  }

  initializeWater(gameMap, tileWater) {
    if (!this.waterInitialized) {
      this.waterInitialized = true;
      this.tileWater = tileWater;
      if (this.tileWater > 100) {
        const neighbors = this.getNeighbors(gameMap);
        for (const direction in neighbors) {
          if (neighbors.hasOwnProperty(direction) && neighbors[direction]) {
            const neighborTile = neighbors[direction];
            neighborTile.initializeWater(
              gameMap,
              getRandomIntInclusive(0, this.tileWater)
            );
          }
        }
      }
      this.setWetStatus();
    }
  }

  setWetStatus() {
    this.land = this.tileWater < 100 ? true : false;
  }
}

module.exports = Tile;
