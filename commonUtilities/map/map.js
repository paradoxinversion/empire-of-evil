const { getRandomIntInclusive } = require("../commonUtilities");

const mapX = 10;
const mapY = 10;

class Tile {
  constructor({ x, y, land = true }) {
    this.x = x;
    this.y = y;
    this.land = land;
    this.tileWater; // for map gen
    this.waterInitialized = false;
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

const createEmptyMap = () => {
  let map = [];
  for (let y = 0; y < mapY; y++) {
    map[y] = [];
    for (let x = 0; x < mapX; x++) {
      tileArgs = {
        x,
        y
      };

      const newTile = new Tile(tileArgs);
      map[y].push(newTile);
    }
  }

  return map;
};

const makeWaterTiles = gameMap => {
  const { height, width } = getMapDimensions(gameMap);
  const majorWaterBodies = 5;
  const maxBaseWater = 5000; // 100 is 'wet'
  for (x = 0; x < majorWaterBodies; x++) {
    const centerX = Math.floor(Math.random() * width);
    const centerY = Math.floor(Math.random() * height);
    const tile = gameMap[centerX][centerY];
    // tile.land = false;
    tile.initializeWater(gameMap, getRandomIntInclusive(500, maxBaseWater));
  }

  return gameMap;
};

const makeMap = () => {
  const emptyMap = createEmptyMap();
  const waterMap = makeWaterTiles(emptyMap);
  const gameMap = waterMap;
  return gameMap;
};

const getMapDimensions = gameMap => {
  return {
    height: gameMap.length,
    width: gameMap[0].length
  };
};
module.exports = {
  makeMap
};
