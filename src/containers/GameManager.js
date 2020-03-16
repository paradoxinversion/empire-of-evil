// TODO: move functions that create data/entities to those files & out of here

import { Container } from "unstated";
import { createNation } from "../data/entities/nation";
import {
  makeMap,
  getLandTiles,
  getRandomLandTile
} from "../commonUtilities/map/gameMap";
import { Citizen } from "../data/entities/citizen";
import { getRandomIntInclusive } from "../commonUtilities/commonUtilities";
class GameManager extends Container {
  state = {
    player: {
      evilEmpire: null
    },
    nations: {},
    citizens: {},
    gameMap: [],
    operations: {},
    selectedTile: null,
    gameReady: false
  };
  createCitizen(x, y) {
    const citizenAttributeMin = 1;
    const citizenAttributeMax = 5;
    const citizenAttributes = {
      name: "Drone",
      strength: getRandomIntInclusive(citizenAttributeMin, citizenAttributeMax),
      intelligence: getRandomIntInclusive(
        citizenAttributeMin,
        citizenAttributeMax
      ),
      administration: getRandomIntInclusive(
        citizenAttributeMin,
        citizenAttributeMax
      ),
      role: 0,
      x,
      y
    };
    const newCitizen = new Citizen(citizenAttributes);
    return newCitizen;
  }
  /**
   * Creates the nations that will be used in the game
   */
  async createNations() {
    const evilEmpire = createNation("EVIL Empire", true);

    const cpuNation = createNation("CPU Nation", false);
    const nations = {
      [evilEmpire.id]: evilEmpire,
      [cpuNation.id]: cpuNation
    };
    return { nations, evilEmpire };
  }

  /**
   * Returns the Player's empire.
   */
  getEvilEmpire() {
    return this.state.nations[this.state.player.evilEmpire.id];
  }

  getEvilAgents(citizensMap, evilEmpireId) {
    return Object.values(citizensMap).filter(
      citizen => citizen.nationId === evilEmpireId && citizen.role > 0
    );
  }
  /**
   *
   * @param {Array} nationsArray - An array of game nations
   * @param {String} evilEmpireId - The evil empire id
   */
  getCPUNation(nationsArray, evilEmpireId) {
    return Object.values(nationsArray).filter(
      nation => nation.id !== evilEmpireId
    );
  }
  getCitizensOnTile(tile, citizensMap) {
    return Object.values(citizensMap).filter(
      citizen =>
        citizen.currentPosition.x === tile.x &&
        citizen.currentPosition.y === tile.y
    );
  }
  /**
   * Set a tile as the one currently selected (or set it null)
   * @param {object} selectedTile - The tile to set, or null to unset
   */
  selectTile(selectedTile) {
    const tile = {};
    const hasEvilNeighbor = selectedTile.hasEvilNeighbor(
      this.state.gameMap,
      this.getEvilEmpire().id
    );
    tile.tile = selectedTile;
    tile.hasEvilNeighbor = hasEvilNeighbor;
    this.setState({ selectedTile: tile });
  }

  /**
   * Runs initial game setup
   */
  async setUpGame() {
    // some constants
    const cpuAgentsPerTile = 5;

    const player = Object.assign({}, this.state.player);
    // Create Map
    const gameMap = await makeMap();

    // Create nations to populate the map & set tile ownership
    const { nations, evilEmpire } = await this.createNations();
    const cpuNation = this.getCPUNation(nations, evilEmpire.id)[0];
    console.log(cpuNation);
    for (let y = 0; y < gameMap.length; y++) {
      for (let x = 0; x < gameMap[y].length; x++) {
        gameMap[y][x].setNationId(cpuNation.id);
      }
    }

    // Set ownership for Evil Empire
    const landTiles = getLandTiles(gameMap);
    const empireStartTile = getRandomLandTile(landTiles);
    empireStartTile.setNationId(evilEmpire.id);
    gameMap[empireStartTile.y][empireStartTile.x] = empireStartTile;

    // Determine tile pops
    const citizens = {};
    for (let y = 0; y < gameMap.length; y++) {
      for (let x = 0; x < gameMap[y].length; x++) {
        const tile = gameMap[y][x];
        if (tile.land) {
          for (let c = 0; c < getRandomIntInclusive(25, 100); c++) {
            const newCitizen = this.createCitizen(x, y);
            newCitizen.setNationId(tile.nationId);
            citizens[newCitizen.id] = newCitizen;
          }
        }
      }
    }

    // Set agent statuses
    for (let y = 0; y < gameMap.length; y++) {
      for (let x = 0; x < gameMap[y].length; x++) {
        const tile = gameMap[y][x];
        if (tile.land) {
          const tileCitizens = this.getCitizensOnTile(tile, citizens);
          for (let a = 0; a < cpuAgentsPerTile; a++) {
            tileCitizens[a].role = 1;
          }
        }
      }
    }

    console.log(this.getEvilAgents(citizens, evilEmpire.id));
    // Set data
    player.evilEmpire = evilEmpire;
    this.setState({ player, nations, citizens, gameMap, gameReady: true });
  }
}

export default new GameManager();
