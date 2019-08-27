const mapX = 10;
const mapY = 10;

class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.land = true;
  }
}

const makeMap = () => {
  let map = [];
  for (let y = 0; y < mapY; y++) {
    map[y] = [];
    for (let x = 0; x < mapX; x++) {
      const newTile = new Tile(x, y);
      map[y].push(newTile);
    }
  }

  return map;
};

module.exports = {
  makeMap
};
