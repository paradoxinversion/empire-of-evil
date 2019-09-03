const {
  getRandomIntInclusive,
  getMapDimensions
} = require("../commonUtilities");
const Tile = require("../../src/entities/tile");
const mapX = 10;
const mapY = 10;

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

module.exports = {
  makeMap
};
