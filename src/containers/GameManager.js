// TODO: move functions that create data/entities to those files & out of here

import { Container } from "unstated";
import { createNation } from "../data/entities/nation";
import {
  makeMap,
  getLandTiles,
  getRandomLandTile
} from "../commonUtilities/map/gameMap";
import { Citizen } from "../data/entities/citizen";
import { Squad } from "../data/entities/squads";
import { getRandomIntInclusive } from "../commonUtilities/commonUtilities";
import faker from "faker";

class GameManager extends Container {
  state = {
    player: {
      evilEmpire: null
    },
    nations: {},
    citizens: {},
    gameMap: [],
    operations: {},
    squads: {},
    selectedTile: null,
    gameReady: false,
    currentScreen: "main"
  };

  createCitizen(x, y) {
    const citizenAttributeMin = 1;
    const citizenAttributeMax = 5;
    const citizenAttributes = {
      name: faker.name.findName(),
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
   * Form a new squas
   * @param {String} name - the new squad's name
   * @param {Array} members - an array of agent ids, including squad leader
   * @param {String} leader - the id of the squad leader
   */
  createSquad(nationId, name, members, leader, role) {
    // Set squad data
    const squad = {
      nationId,
      name,
      members, //array of integers?
      leader, //id
      role
    };

    // Create Squad
    const newSquad = new Squad(squad);

    // Prepare updated squad info
    const squads = Object.assign({}, this.state.squads);
    squads[newSquad.id] = newSquad;

    // Prepare updated citizen info
    const citizens = Object.assign({}, this.state.citizens);
    members.forEach(memberId => {
      citizens[memberId].setSquadId(newSquad.id);
    });

    // Update info
    this.setState({ squads, citizens });
    return newSquad;
  }

  disbandSquad(squadId) {
    // Reset squad member's associatons
    const citizens = Object.assign({}, this.state.citizens);
    this.state.squads[squadId].members.forEach(memberId => {
      citizens[memberId].setSquadId(-1);
    });

    const squads = Object.assign({}, this.state.squads);
    delete squads[squadId];

    this.setState({ citizens, squads });
  }

  /**
   * Returns the Player's empire.
   */
  getEvilEmpire() {
    return this.state.nations[this.state.player.evilEmpire.id];
  }

  /**
   *
   * @param {Object} citizensMap - A map of all game citizens that are Agents of of the evil empire
   * @param {String} evilEmpireId - The string ID of the evil empire
   * @param {String} role - The string role (0, 1, 2, or <falsey>) of the citizen to find, falsey values get ALL agents
   */
  getEvilAgents(citizensMap, evilEmpireId, role) {
    const allAgents = Object.values(citizensMap).filter(
      citizen => citizen.nationId === evilEmpireId && citizen.role > 0
    );
    if (!role) {
      return allAgents;
    } else {
      return allAgents.filter(agent => agent.role === role);
    }
  }

  getAgents(citizensMap, nationId, role) {
    const allAgents = Object.values(citizensMap).filter(
      citizen => citizen.nationId === nationId && citizen.role > 0
    );
    if (!role) {
      return allAgents;
    } else {
      return allAgents.filter(agent => agent.role === role);
    }
  }

  getSquadlessAgents(citizensMap, nationId, role) {
    return this.getAgents(citizensMap, nationId, role).filter(
      agent => agent.squadId === -1
    );
  }

  getSquads(squadsMap, nationId, squadRole) {
    const allSquads = Object.values(squadsMap).filter(
      squad => squad.nationId === nationId
    );
    if (!squadRole) {
      return allSquads;
    } else {
      return allSquads.filter(squad => squad.role === squadRole);
    }
  }

  /**
   * Return all game citizens.
   */
  getCitizens = () => {
    return this.state.citizens;
  };

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
    if (!citizensMap) citizensMap = this.state.citizens;
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
    tile.citizens = this.getCitizensOnTile(selectedTile, this.state.citizens);
    this.setState({ selectedTile: tile });
  }
  setScreen(currentScreen) {
    this.setState({ currentScreen });
  }

  /**
   * Runs initial game setup
   */
  async setUpGame() {
    // some constants
    const cpuAgentsPerTile = 8;

    const player = Object.assign({}, this.state.player);
    // Create Map
    const gameMap = await makeMap();

    // Create nations to populate the map & set tile ownership
    const { nations, evilEmpire } = await this.createNations();
    const cpuNation = this.getCPUNation(nations, evilEmpire.id)[0];
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
          for (let c = 0; c < getRandomIntInclusive(25, 150); c++) {
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
            if (a < 3) {
              tileCitizens[a].role = 1;
            } else if (a === 3) {
              tileCitizens[a].role = 2;
            } else if (a === 4) {
              tileCitizens[a].role = 3;
            }
          }
        }
      }
    }

    // console.log(this.getEvilAgents(citizens, evilEmpire.id));
    // Set data
    player.evilEmpire = evilEmpire;
    this.setState({ player, nations, citizens, gameMap, gameReady: true });
  }
}

export default new GameManager();
