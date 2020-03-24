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
  getTileById(tileID) {
    return this.state.gameMap.flat().find(tile => tile.id === tileID);
  }
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

  getAdjacentSquads(nationId, tile) {
    // look at each neighboring tile
    const neighbors = tile.getNeighbors(this.state.gameMap);
    for (neighbor in neighbors) {
      // check squad positions against neighbor tile position
    }
    // if the tile has a squad, add it to an array inside of a map
    // map keys are n/e/s/w, depending on what tiles have squads
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

  getAgentsOnTile(citizensMap, nationId, role, tile) {
    return (nationAgents = this.getAgents(citizensMap, nationId, role).filter(
      agent =>
        agent.currentPosition.x === tile.tile.x &&
        agent.currentPosition.y === tile.tile.y
    ));
  }
  getAllAgentsOnTile(tile) {
    return Object.values(this.state.citizens).filter(
      citizen =>
        citizen.role > 0 &&
        citizen.currentPosition.x === tile.x &&
        citizen.currentPosition.y === tile.y
    );
  }
  getSquadlessAgents(citizensMap, nationId, role) {
    return this.getAgents(citizensMap, nationId, role).filter(
      agent => agent.squadId === -1
    );
  }

  getSquadlessAgentsOnTile(citizensMap, nationId, role, tile) {
    const t = this.getSquadlessAgents(citizensMap, nationId, role).filter(
      agent => {
        return (
          agent.currentPosition.y === tile.tile.y &&
          agent.currentPosition.x === tile.tile.x
        );
      }
    );
    return t;
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

  getSquadsOnTile(nationId, tile) {
    const squads = this.getSquads(this.state.squads, nationId).filter(squad => {
      return (
        squad.currentPosition.x === tile.x && squad.currentPosition.y === tile.y
      );
    });
    return squads;
  }

  getFreeSquads(nationId) {
    const allSquads = this.getSquads(this.state.squads, nationId);
    // filter squads where squad id is not present in squad list of any operations
    const freeSquads = allSquads.filter(squad => {
      // is the squad id in any of the operations?
      for (let x = 0; x < this.state.operations.length; x++) {
        if (this.state.operations[x].squads.includes(squad.id)) return false;
      }
      return true;
    });
    return freeSquads;
  }

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

  setSquadLocation(x, y, squadId) {
    // set the squad's location
    const squads = Object.assign({}, this.state.squads);
    squads[squadId].currentPosition.x = x;
    squads[squadId].currentPosition.y = y;

    // set the location of each member in the squad
    const citizens = Object.assign({}, this.state.citizens);
    for (let citizenId in squads[squadId].members) {
      debugger;
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
    const enemies = combatantList.filter(agent => agent.nationId !== nationId);
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
    combatants.forEach(combatant => {
      const target = this.getEnemyCombatant(combatants, combatant.nationId);
      target.currentHealth -= combatant.strength;
      console.log(
        `${combatant.name} targets ${target.name} (targeh hp: ${target.currentHealth}/${target.health})`
      );
      citizens[target.id] = target;
    });

    // update agents in container
    this.setState({
      citizens
    });
  }

  clearOperations() {
    this.state.operations = [];
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
