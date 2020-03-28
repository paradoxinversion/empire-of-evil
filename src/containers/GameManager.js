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
import { Operation } from "../data/operation";
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
    operations: [],
    squads: {},
    selectedTile: null,
    gameReady: false,
    currentScreen: "main"
  };

  /**
   * Retrieve a tile from the map by its ID
   * @param {String} tileID - the string id of the tile to retrieve
   */
  getTileById(tileID) {
    return this.state.gameMap.flat().find(tile => tile.id === tileID);
  }

  getSelectedTile() {
    return this.state.selectedTile;
  }
  /**
   * Create a new citizen -- This does not set nation.
   * @param {number} x - position x at which to spawn the citizen
   * @param {number} y - position y at which to spawn the citizen
   */
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
    return { nations, cpuNation, evilEmpire };
  }

  /**
   * Form a new squad
   * @param {String} name - the new squad's name
   * @param {Array} members - an array of agent ids, including squad leader
   * @param {String} leader - the id of the squad leader
   */
  async createSquad(nationId, name, members, leader, role, tile) {
    // Set squad data
    const squad = {
      nationId,
      name,
      members, //array of integers?
      leader, //id
      role,
      x: tile.x,
      y: tile.y
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
    await this.setState({ squads, citizens });
    return newSquad;
  }

  /**
   * Disbands a squad, resetting all member's sqaud id's and
   * removing it form the state
   * @param {String} squadId  - The ID of the squad to remove
   */
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
   * @param {String} role - The string role (0, 1, 2, or <falsey>) of the citizen to find, falsey values get ALL agents
   */
  getEvilAgents(role) {
    const allAgents = Object.values(this.state.citizens).filter(
      citizen =>
        citizen.nationId === this.getEvilEmpire().id && citizen.role > 0
    );
    if (!role) {
      return allAgents;
    } else {
      return allAgents.filter(agent => agent.role === role);
    }
  }

  /**
   * Returns all agents belonging to a supplied Nation (by ID).
   *
   * If a role is supplied, return agents that also match that role,
   * otherwise, return all agents.
   * @param {Object} citizensMap - a map of all citizens (!!! this should reference the state directly)
   * @param {string} nationId - The id of the nation who's agents to retrieve
   * @param {string} role - The role of the agents to retrive
   */
  getAgents(nationId, role) {
    const allAgents = Object.values(this.state.citizens).filter(
      citizen => citizen.nationId === nationId && citizen.role > 0
    );
    if (!role) {
      return allAgents;
    } else {
      return allAgents.filter(agent => agent.role === role);
    }
  }

  /**
   * Return agents on a tile that do not belong to the EVIL Empire.
   * @param {Object} tile - The tile object from which to retrieve agents
   */
  getCPUAgentsOnTile(tile) {
    return Object.values(this.state.citizens).filter(
      citizen =>
        citizen.nationId !== this.getEvilEmpire().id &&
        citizen.currentPosition.x === tile.x &&
        citizen.currentPosition.y === tile.y
    );
  }

  /**
   * Return all agents on a tile, regardless of nationality.
   * @param {Object} tile - The tile object from which to retrieve agents
   */
  getAllAgentsOnTile(tile) {
    return Object.values(this.state.citizens).filter(
      citizen =>
        citizen.role > 0 &&
        citizen.currentPosition.x === tile.x &&
        citizen.currentPosition.y === tile.y
    );
  }

  /**
   * Return all agents of the supplied Nation (by ID) that are not
   * currently in a squad.
   * @param {*} citizensMap
   * @param {*} nationId
   * @param {*} role
   */
  getSquadlessAgents(nationId) {
    return Object.values(this.state.citizens).filter(
      citizen =>
        citizen.nationId === nationId &&
        citizen.role > 0 &&
        citizen.squadId === -1
    );
  }

  /**
   *
   * @param {*} citizensMap
   * @param {*} nationId
   * @param {*} role
   * @param {*} tile
   */
  getSquadlessAgentsOnTile(nationId, tile) {
    return Object.values(this.state.citizens).filter(
      citizen =>
        citizen.nationId === nationId &&
        citizen.role > 0 &&
        citizen.squadId === -1 &&
        citizen.currentPosition.y === tile.tile.y &&
        citizen.currentPosition.x === tile.tile.x
    );
  }

  /**
   * Return all squads from the supplied Nation (by id) according to squad role.
   * @param {*} squadsMap
   * @param {*} nationId
   * @param {*} squadRole
   */
  getSquads(nationId, squadRole) {
    const allSquads = Object.values(this.state.squads).filter(
      squad => squad.nationId === nationId
    );
    if (!squadRole) {
      return allSquads;
    } else {
      return allSquads.filter(squad => squad.role === squadRole);
    }
  }

  /**
   * Return all squads from the supplied Nation (by id) if their current location
   * is the supplied tile.
   * @param {*} nationId
   * @param {*} tile
   */
  getSquadsOnTile(nationId, tile) {
    const squads = Object.values(this.state.squads).filter(
      squad =>
        squad.nationId === nationId &&
        squad.currentPosition.x === tile.x &&
        squad.currentPosition.y === tile.y
    );

    return squads;
  }

  /**
   * Return squads of the supplied nation (By id) that are not involved in any operations
   * @param {*} nationId
   */
  getFreeSquads(nationId) {
    const allSquads = Object.values(this.state.squads).filter(
      squad => squad.nationId === nationId
    );
    // filter squads where squad id is not present in squad list of any operations
    const freeSquads = allSquads.filter(squad => {
      // is the squad id in any of the operations?
      for (let x = 0; x < this.state.operations.length; x++) {
        if (this.state.operations[x].squads.includes(squad.id)) {
          console.log("squad in op");
          return false;
        }
      }
      return true;
    });
    return freeSquads;
  }

  getOccupiedSquads() {
    const squads = this.state.operations.reduce((accumulator, operation) => {
      debugger;
      operation.squads.forEach(squad => {
        if (!accumulator[squad.id]) {
          accumulator[squad.id] = operation.name;
        }
      });

      return accumulator;
    }, {});
    console.log(squads);
    return squads;
  }

  /**
   * Add a new operation to the execution list
   * @param {*} operationType
   * @param {*} squads
   * @param {*} targetTile
   */
  addOperation(operationType, squads, targetTile) {
    let targetTileId = "";
    switch (operationType.targetType) {
      case "selected-tile":
        targetTileId = this.state.selectedTile.tile.id;
        break;

      default:
        targetTileId = targetTile.tile.id;
        break;
    }

    const operation = {
      squads,
      operationType,
      targetTileId
    };
    const newOperation = new Operation(operation);
    const operations = this.state.operations.slice(0);
    operations.push(newOperation);
    this.setState({ operations });
  }
  cancelOperation(operationId) {
    const operations = this.state.operations.filter(
      operation => operation.id !== operationId
    );
    this.setState({ operations });
  }
  setSquadLocation(x, y, squadId) {
    // set the squad's location
    const squads = Object.assign({}, this.state.squads);
    squads[squadId].currentPosition.x = x;
    squads[squadId].currentPosition.y = y;

    // set the location of each member in the squad
    const citizens = Object.assign({}, this.state.citizens);
    for (let citizenId in squads[squadId].members) {
      citizens[squads[squadId].members[citizenId]].currentPosition.x = x;
      citizens[squads[squadId].members[citizenId]].currentPosition.y = y;
    }

    this.setState({ squads, citizens });
  }

  /**
   * Return all game citizens.
   */
  getCitizens = () => {
    return this.state.citizens;
  };

  getOperations = () => {
    return this.state.operations;
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

  getCitizensOnTile(tile, citizensMap = this.state.citizens) {
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
    tile.neighbors = selectedTile.getNeighbors(this.state.gameMap);
    tile.adjacentSquads = {};
    for (let neighbor in tile.neighbors) {
      let squads = [];
      let squadsOnTile = [];
      const currentTile = tile.neighbors[neighbor];
      if (!currentTile) continue;
      for (let squad in this.state.squads) {
        squadsOnTile = this.getSquadsOnTile(
          this.getEvilEmpire().id,
          tile.neighbors[neighbor]
        );

        // squads = squads.concat(squadsOnTile);
        // squads.push(squadsOnTile);
      }
      if (squadsOnTile.length > 0) tile.adjacentSquads[neighbor] = squadsOnTile;
    }
    this.setState({ selectedTile: tile });
  }

  setScreen(currentScreen) {
    this.setState({ currentScreen });
  }

  async waitAndExecuteOperations() {
    await this.setState({
      currentScreen: "operation-resolution"
    });
  }

  /**
   *
   * @param {*} combatantList
   * @param {*} nationId - the nation id of this agent
   */
  getEnemyCombatant(combatantList, nationId) {
    const enemies = combatantList.filter(
      agent => agent.nationId !== nationId && agent.alive
    );
    if (enemies.length === 0) return false;
    return enemies[getRandomIntInclusive(0, enemies.length - 1)];
  }
  /**
   * Execute tile combat between the EoE and other nations
   * @param {*} tile
   */
  doTileCombat(tile, attackerId) {
    const citizens = Object.assign({}, this.state.citizens);
    // Gather combatants
    // const combatants = this.getAllAgentsOnTile(tile).reduce(
    //   (acc, combatant) => {
    //     let key = combatant.nationId;
    //     if (!acc[key]) {
    //       acc[key] = [];
    //     }
    //     acc[key].push(combatant);
    //     return acc;
    //   },
    //   {}
    // );

    const combatants = this.getAllAgentsOnTile(tile);
    console.log(combatants);

    // Execute attacks for each character
    // super simple combat for now
    combatants.forEach(combatant => {
      if (combatant.alive) {
        const target = this.getEnemyCombatant(combatants, combatant.nationId);
        if (target) {
          target.currentHealth -= combatant.strength;
          if (target.currentHealth <= 0) {
            target.alive = false;
          }
          console.log(
            `${combatant.name} targets ${target.name} (target hp: ${target.currentHealth}/${target.health})`
          );
          citizens[target.id] = target;
        }
      }
    });

    // update agents in container
    this.setState({
      citizens
    });
  }

  clearOperations() {
    this.state.operations = [];
  }

  changeTileOwner(tile, newOwnerId) {
    tile.setNationId(newOwnerId);
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
    const { nations, cpuNation, evilEmpire } = await this.createNations();
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
            tileCitizens[a].role = 1;
          }
        }
      }
    }

    // Set data
    player.evilEmpire = evilEmpire;
    this.setState({ player, nations, citizens, gameMap, gameReady: true });
  }
}

export default new GameManager();
