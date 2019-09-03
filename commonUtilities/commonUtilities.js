function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

const getMapDimensions = gameMap => {
  return {
    height: gameMap.length,
    width: gameMap[0].length
  };
};

module.exports = { getRandomIntInclusive, getMapDimensions };
