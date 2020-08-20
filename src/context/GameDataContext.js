import React, { useState } from "react";
// import { Provider } from "unstated";
// TODO: move functions that create data/entities to those files & out of here
import { createNation, createNations } from "../data/entities/nation";
import {
  makeMap,
  getLandTiles,
  getRandomLandTile,
} from "../commonUtilities/map/gameMap";
import { Citizen } from "../data/entities/citizen";
import { Squad } from "../data/entities/squads";
import Tile from "../data/entities/tile";
import { Operation } from "../data/gameEvents/operation";
import { getRandomIntInclusive } from "../commonUtilities/commonUtilities";
import { activityTypes } from "../data/gameEvents/activity";
import { incidentTypes, incidentFrequency } from "../data/gameEvents/incident";
import { Shufflebag } from "../utilities";
import faker from "faker";
import moment from "moment";
import store from "store";

const GameDataContext = React.createContext();
const { Provider } = GameDataContext;

const GameDataProvider = ({ children, gameData }) => {
  const [gameState, setGameState] = useState({
    player: {
      evilEmpire: null,
    },
    nations: {},
    citizens: {},
    gameMap: [],
    operations: [],
    activities: {}, // a map with activity type keys and citizen id arrays
    activityConsequences: [],
    squads: {},
    selectedTile: null,
    selectedAgent: null,
    selectedSquad: null,
    gameReady: false,
    gameDate: moment("2000-1-1"),

    currentScreen: "title",
    incidents: [],
    incidentShuffle: Shufflebag(incidentFrequency),
  });

  const saveGame = () => {
    const data = {
      gameDate: gameState.gameDate.toDate(),
      player: gameState.player,
      nations: gameState.nations,
      citizens: gameState.citizens,
      gameMap: gameState.gameMap,
      operations: gameState.operations,
      activities: gameState.activities,
      squads: gameState.squads,
    };
    store.set("eoe-gamedata", data);
  };

  const loadGame = async () => {
    const gameData = store.get("eoe-gamedata");
    const gameDate = moment(gameData.gameDate);
    const player = gameData.player;
    const rawNations = gameData.nations;
    const nations = {};
    for (let nationId in rawNations) {
      const nationObject = createNation("LOADED NATION", false);
      const nation = Object.assign(nationObject, rawNations[nationId]);
      nations[nationId] = nation;
    }

    const rawCitizens = gameData.citizens;
    const citizens = {};
    for (let citizenId in rawCitizens) {
      const citizenObject = createCitizen(0, 0);
      const citizen = Object.assign(citizenObject, rawCitizens[citizenId]);
      citizens[citizenId] = citizen;
    }
    const rawGameMap = gameData.gameMap;
    const gameMap = makeMap();
    for (let y = 0; y < gameMap.length; y++) {
      for (let x = 0; x < gameMap.length; x++) {
        const tileObject = new Tile({ x: 0, y: 0 });
        const tile = Object.assign(tileObject, rawGameMap[x][y]);
        gameMap[x][y] = tile;
      }
    }

    const operations = gameData.operations;
    const activities = gameData.activities;
    const squads = gameData.squads;
    setGameState({
      gameDate,
      player,
      nations,
      citizens,
      gameMap,
      operations,
      activities,
      squads,
      gameReady: true,
    });
  };
  /*
    Tile Functions
  */

  const getTileByCoordinates = (x, y) => {
    return gameState.gameMap
      .flat()
      .find((tile) => tile.x === x && tile.y === y);
  };
  /**
   * Retrieve a tile from the map by its ID
   * @param {String} tileID - the string id of the tile to retrieve
   */
  const getTileById = (tileID) => {
    return gameState.gameMap.flat().find((tile) => tile.id === tileID);
  };

  const getSelectedTile = () => {
    return gameState.selectedTile;
  };

  /*
    Citizen/Agent Functions
  */

  const selectAgent = async (agent) => {
    setGameState({
      ...gameState,
      selectedAgent: { agentData: agent },
    });
  };

  const getRandomCitizensOnTile = (tile, amount) => {
    const possibleCitizens = Object.values(gameState.citizens).filter(
      (citizen) =>
        citizen.role === 0 &&
        citizen.currentPosition.x === tile.x &&
        citizen.currentPosition.y === tile.y
    );

    const chosenCitizens = [];

    for (let i = 0; i < amount; i++) {
      const chosenCitizenIndex = getRandomIntInclusive(
        0,
        possibleCitizens.length - 1
      );
      chosenCitizens.push(possibleCitizens[chosenCitizenIndex]);
      possibleCitizens.splice(chosenCitizenIndex, 1);
    }
    return chosenCitizens;
  };

  /**
   * Convert a tile citizen to an agent of the nation controlling the tile
   */
  const convertTileCitizenToAgent = async (tile) => {
    const nonAgents = Object.values(gameState.citizens).filter(
      (citizen) =>
        citizen.role === 0 &&
        citizen.currentPosition.x === tile.x &&
        citizen.currentPosition.y === tile.y
    );
    const chosenCitizen =
      nonAgents[getRandomIntInclusive(0, nonAgents.length - 1)];
    chosenCitizen.role = 1;
    setGameState({
      ...gameState,
      citizens: { ...gameState.citizens, [chosenCitizen.id]: chosenCitizen },
    });
  };

  const getAgentsOnTile = (nationId, tile, role) => {
    const allAgents = Object.values(gameState.citizens).filter(
      (citizen) =>
        citizen.nationId === nationId &&
        citizen.role > 0 &&
        citizen.currentPosition.x === tile.tile.x &&
        citizen.currentPosition.y === tile.tile.y
    );
    if (!role) {
      return allAgents;
    } else {
      return allAgents.filter((agent) => agent.role === role);
    }
  };

  const setAgentActivity = (agentId, activity) => {
    const activities = Object.assign({}, gameState.activities);
    if (!activities[activity]) activities[activity] = [];
    activities[activity].push(agentId);
    setGameState(...gameState, { activities });
    return activities;
  };

  const clearAgentActivity = (agentId) => {
    const activities = Object.assign({}, gameState.activities);

    for (let activity in activities) {
      const agentIndex = activities[activity].findIndex(
        (agent) => (agent.id = agentId)
      );
      if (agentIndex) {
        activities[activities].splice(agentIndex, 1);
      }
    }
    setGameState({
      ...gameState,
      activities,
    });
  };

  const getAgentActivity = (agentId) => {
    const activities = Object.assign({}, gameState.activities);
    let act = "";
    for (let activity in activities) {
      const agentIndex = activities[activity].findIndex(
        (agent) => agent === agentId
      );
      if (agentIndex !== -1) act = activity;
    }
    if (act) return activityTypes[act].name;
    return null;
  };

  /**
   * Return agents that are busy because they are engaged in activities
   * or in squads that are queued for an operation
   * @returns An array containing the ids of all busy agents
   */
  const getBusyAgents = () => {
    let busyAgents = [];
    gameState.operations.forEach((operation) => {
      operation.squads.forEach((squad) => {
        busyAgents = busyAgents.concat(squad.members);
      });
    });

    for (let activity in gameState.activities) {
      busyAgents = busyAgents.concat(gameState.activities[activity]);
    }
    return busyAgents;
  };

  /*
    Date Functions
  */
  const getFormattedDate = () => {
    return gameState.gameDate.format("dddd, MMMM Do YYYY");
  };

  const advanceDay = () => {
    const gameDate = gameState.gameDate.add(1, "days");
    setGameState({
      ...gameState,
      gameDate,
    });
  };

  const selectSquad = (squad, openSquadProfile) => {
    // setGameState({
    //   ...gameState,
    //   selectedSquad: { squadData: squad },
    // });
    setGameState({
      ...gameState,
      currentScreen: openSquadProfile
        ? "profile-squad"
        : gameState.currentScreen,
      selectedSquad: { squadData: squad },
    });
  };

  /**
   * Create a new citizen -- This does not set nation.
   * @param {number} x - position x at which to spawn the citizen
   * @param {number} y - position y at which to spawn the citizen
   */
  const createCitizen = (x, y) => {
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
      y,
    };
    const newCitizen = new Citizen(citizenAttributes);
    return newCitizen;
  };

  /**
   * Creates the nations that will be used in the game
   */
  const createNations = async () => {
    const evilEmpire = createNation("EVIL Empire", true);

    const cpuNation = createNation("CPU Nation", false);
    const nations = {
      [evilEmpire.id]: evilEmpire,
      [cpuNation.id]: cpuNation,
    };
    return { nations, cpuNation, evilEmpire };
  };

  /**
   * Form a new squad
   * @param {String} name - the new squad's name
   * @param {Array} members - an array of agent ids, including squad leader
   * @param {String} leader - the id of the squad leader
   */
  const createSquad = async (nationId, name, members, leader, role, tile) => {
    // Set squad data
    const squad = {
      nationId,
      name,
      members, //array of integers?
      leader, //id
      role,
      x: tile.x,
      y: tile.y,
    };

    // Create Squad
    const newSquad = new Squad(squad);

    // Prepare updated squad info
    const squads = Object.assign({}, gameState.squads);
    squads[newSquad.id] = newSquad;

    // Prepare updated citizen info
    const citizens = Object.assign({}, gameState.citizens);
    members.forEach((memberId) => {
      citizens[memberId].setSquadId(newSquad.id);
    });

    // Update info
    setGameState({ ...gameState, squads, citizens });
    return newSquad;
  };

  /**
   * Disbands a squad, resetting all member's sqaud id's and
   * removing it form the state
   * @param {String} squadId  - The ID of the squad to remove
   */
  const disbandSquad = (squadId) => {
    // Reset squad member's associatons
    const citizens = Object.assign({}, gameState.citizens);
    gameState.squads[squadId].members.forEach((memberId) => {
      citizens[memberId].setSquadId(-1);
    });

    const squads = Object.assign({}, gameState.squads);
    delete squads[squadId];

    setGameState({ ...gameState, citizens, squads });
  };

  /**
   * Returns the Player's empire.
   */
  const getEvilEmpire = () => {
    return gameState.nations[gameState.player.evilEmpire.id];
  };

  /**
   *
   * @param {String} role - The string role (0, 1, 2, or <falsey>) of the citizen to find, falsey values get ALL agents
   */
  const getEvilAgents = (role) => {
    const allAgents = Object.values(gameState.citizens).filter(
      (citizen) => citizen.nationId === getEvilEmpire().id && citizen.role > 0
    );
    if (!role) {
      return allAgents;
    } else {
      return allAgents.filter((agent) => agent.role === role);
    }
  };

  /**
   * Returns all agents belonging to a supplied Nation (by ID).
   *
   * If a role is supplied, return agents that also match that role,
   * otherwise, return all agents.
   * @param {Object} citizensMap - a map of all citizens (!!! this should reference the state directly)
   * @param {string} nationId - The id of the nation who's agents to retrieve
   * @param {string} role - The role of the agents to retrive
   */
  const getAgents = (nationId, role) => {
    const allAgents = Object.values(gameState.citizens).filter(
      (citizen) => citizen.nationId === nationId && citizen.role > 0
    );
    if (!role) {
      return allAgents;
    } else {
      return allAgents.filter((agent) => agent.role === role);
    }
  };

  /**
   * Return agents on a tile that do not belong to the EVIL Empire.
   * @param {Object} tile - The tile object from which to retrieve agents
   */
  const getCPUAgentsOnTile = (tile) => {
    return Object.values(gameState.citizens).filter(
      (citizen) =>
        citizen.nationId !== getEvilEmpire().id &&
        citizen.currentPosition.x === tile.x &&
        citizen.currentPosition.y === tile.y
    );
  };

  /**
   * Return all agents on a tile, regardless of nationality.
   * @param {Object} tile - The tile object from which to retrieve agents
   */
  const getAllAgentsOnTile = (tile) => {
    return Object.values(gameState.citizens).filter(
      (citizen) =>
        citizen.role > 0 &&
        citizen.currentPosition.x === tile.x &&
        citizen.currentPosition.y === tile.y
    );
  };

  /**
   * Return all agents of the supplied Nation (by ID) that are not
   * currently in a squad.
   * @param {*} citizensMap
   * @param {*} nationId
   * @param {*} role
   */
  const getSquadlessAgents = (nationId) => {
    return Object.values(gameState.citizens).filter(
      (citizen) =>
        citizen.nationId === nationId &&
        citizen.role > 0 &&
        citizen.squadId === -1
    );
  };

  /**
   *
   * @param {*} citizensMap
   * @param {*} nationId
   * @param {*} role
   * @param {*} tile
   */
  const getSquadlessAgentsOnTile = (nationId, tile) => {
    return Object.values(gameState.citizens).filter(
      (citizen) =>
        citizen.nationId === nationId &&
        citizen.role > 0 &&
        citizen.squadId === -1 &&
        citizen.currentPosition.y === tile.tile.y &&
        citizen.currentPosition.x === tile.tile.x
    );
  };

  /**
   * Return all squads from the supplied Nation (by id) according to squad role.
   * @param {*} squadsMap
   * @param {*} nationId
   * @param {*} squadRole
   */
  const getSquads = (nationId, squadRole) => {
    const allSquads = Object.values(gameState.squads).filter(
      (squad) => squad.nationId === nationId
    );
    if (!squadRole) {
      return allSquads;
    } else {
      return allSquads.filter((squad) => squad.role === squadRole);
    }
  };

  /**
   * Return all squads from the supplied Nation (by id) if their current location
   * is the supplied tile.
   * @param {*} nationId
   * @param {*} tile
   */
  const getSquadsOnTile = (nationId, tile) => {
    const squads = Object.values(gameState.squads).filter(
      (squad) =>
        squad.nationId === nationId &&
        squad.currentPosition.x === tile.x &&
        squad.currentPosition.y === tile.y
    );

    return squads;
  };

  /**
   * Return squads of the supplied nation (By id) that are not involved in any operations
   * @param {*} nationId
   */
  const getFreeSquads = (nationId) => {
    const allSquads = Object.values(gameState.squads).filter(
      (squad) => squad.nationId === nationId
    );
    // filter squads where squad id is not present in squad list of any operations
    const freeSquads = allSquads.filter((squad) => {
      // is the squad id in any of the operations?
      for (let x = 0; x < gameState.operations.length; x++) {
        if (gameState.operations[x].squads.includes(squad.id)) {
          console.log("squad in op");
          return false;
        }
      }
      return true;
    });
    return freeSquads;
  };

  const getOccupiedSquads = () => {
    const squads = gameState.operations.reduce((accumulator, operation) => {
      operation.squads.forEach((squad) => {
        if (!accumulator[squad.id]) {
          accumulator[squad.id] = operation.name;
        }
      });

      return accumulator;
    }, {});
    return squads;
  };

  /**
   * Add a new operation to the execution list
   * @param {*} gameEventData
   * @param {*} squads
   * @param {*} targetTile
   */
  const addOperation = (gameEventData, squads, targetTile) => {
    let targetTileId = "";
    switch (gameEventData.targetType) {
      case "selected-tile":
        targetTileId = gameState.selectedTile.tile.id;
        break;

      default:
        targetTileId = targetTile.tile.id;
        break;
    }

    const operation = {
      squads,
      operationType,
      targetTileId,
      gameEventData,
    };
    const newOperation = new Operation(operation);
    const operations = gameState.operations.slice(0);
    operations.push(newOperation);
    setGameState({ ...gameState, operations });
  };

  const setSquadLocation = (x, y, squadId) => {
    // set the squad's location
    const squads = Object.assign({}, gameState.squads);
    squads[squadId].currentPosition.x = x;
    squads[squadId].currentPosition.y = y;

    // set the location of each member in the squad
    const citizens = Object.assign({}, gameState.citizens);
    for (let citizenId in squads[squadId].members) {
      citizens[squads[squadId].members[citizenId]].currentPosition.x = x;
      citizens[squads[squadId].members[citizenId]].currentPosition.y = y;
    }

    setGameState({ ...gameState, squads, citizens });
  };

  /**
   * Return all game citizens.
   */
  const getCitizens = () => {
    return gameState.citizens;
  };

  const getOperations = () => {
    return gameState.operations;
  };

  /**
   *
   * @param {Array} nationsArray - An array of game nations
   * @param {String} evilEmpireId - The evil empire id
   */
  const getCPUNation = (nationsArray, evilEmpireId) => {
    return Object.values(nationsArray).filter(
      (nation) => nation.id !== evilEmpireId
    );
  };

  const getCitizensOnTile = (tile, citizensMap = gameState.citizens) => {
    return Object.values(citizensMap).filter(
      (citizen) =>
        citizen.currentPosition.x === tile.x &&
        citizen.currentPosition.y === tile.y
    );
  };

  const getNationTiles = (nationId) => {
    return gameState.gameMap
      .flat()
      .filter((tile) => tile.nationId === nationId);
  };
  const getRandomNationTile = (nationId) => {
    const nationTiles = getNationTiles(nationId);
    return nationTiles[getRandomIntInclusive(0, nationTiles.length - 1)];
  };
  /**
   * Set a tile as the one currently selected (or set it null)
   * @param {object} selectedTile - The tile to set, or null to unset
   */
  const selectTile = (selectedTile) => {
    const tile = {};
    const hasEvilNeighbor = selectedTile.hasEvilNeighbor(
      gameState.gameMap,
      getEvilEmpire().id
    );
    tile.tile = selectedTile;
    tile.hasEvilNeighbor = hasEvilNeighbor;
    tile.citizens = getCitizensOnTile(selectedTile, gameState.citizens);
    tile.neighbors = selectedTile.getNeighbors(gameState.gameMap);
    tile.adjacentSquads = {};
    for (let neighbor in tile.neighbors) {
      let squads = [];
      let squadsOnTile = [];
      const currentTile = tile.neighbors[neighbor];
      if (!currentTile) continue;
      for (let squad in gameState.squads) {
        squadsOnTile = getSquadsOnTile(
          getEvilEmpire().id,
          tile.neighbors[neighbor]
        );

        // squads = squads.concat(squadsOnTile);
        // squads.push(squadsOnTile);
      }
      if (squadsOnTile.length > 0) tile.adjacentSquads[neighbor] = squadsOnTile;
    }
    setGameState({ ...gameState, selectedTile: tile });
  };

  const setScreen = (currentScreen) => {
    setGameState({ ...gameState, currentScreen });
  };

  const generateIncidents = () => {
    const options = Object.keys(incidentTypes);
    const incident = options[getRandomIntInclusive(0, options.length - 1)];
    console.log(incidentTypes[incident]);
  };

  const waitAndExecuteOperations = async () => {
    const incidentRoll = gameState.incidentShuffle.next();
    const incidents = gameState.incidents;
    incidents.push(incidentTypes[incidentRoll]);
    // if (gameState.operations.le)
    executeActivities();
    setGameState({
      ...gameState,
      currentScreen: "turn-resolution",
      incidents: [...gameState.incidents],
    });
    // generateIncidents();
    await advanceDay();
    if (gameState.gameDate.date() === 1) {
      // handle monthly expenses here
      console.log("first of the month");
    }
  };

  const executeActivities = async () => {
    function getActivityReward(activityType, agent) {
      //TODO: Change this to a shufflebag maybe
      const isConsequence = getRandomIntInclusive(0, 10) > 8 ? true : false;
      let reward = 0;
      if (isConsequence) {
        const incidentData = incidentTypes[activityType.consequenceIncident];
        const incident = {
          name: incidentData.name,
          agent,
          gameEventData: incidentData,
        };
        return { reward, rewardType: activityType.effect, incident };
      } else {
        reward = getRandomIntInclusive(activityType.min, activityType.max);
        return { reward, rewardType: activityType.effect, incident: null };
      }
    }
    const rewards = {};
    const incidents = [];
    for (let activityType in gameState.activities) {
      // For now, just get the rewards for each member
      // ! In the future, there should be a 'fail' chance before reward (and possible none if failure occurs)
      gameState.activities[activityType].forEach((citizenId) => {
        const agent = gameState.citizens[citizenId];
        const { reward, rewardType, incident } = getActivityReward(
          activityTypes[activityType],
          agent
        );
        if (!incident) {
          if (!rewards[rewardType]) {
            rewards[rewardType] = reward;
          } else {
            rewards[rewardType] += reward;
          }
        } else {
          incidents.push(incident);
        }
      });
    }
    const evilEmpire = getEvilEmpire();
    if (rewards["0"]) evilEmpire.nationalControl += rewards[0];
    if (rewards["1"]) evilEmpire.cash += rewards[1];
    setGameState({
      ...gameState,
      nations: { ...gameState.nations, [evilEmpire.id]: evilEmpire },
      activityConsequences: incidents,
    });
  };

  /**
   *
   * @param {*} combatantList
   * @param {*} nationId - the nation id of this agent
   */
  const getEnemyCombatant = (combatantList, nationId) => {
    const enemies = combatantList.filter(
      (agent) => agent.nationId !== nationId && agent.alive
    );
    if (enemies.length === 0) return false;
    return enemies[getRandomIntInclusive(0, enemies.length - 1)];
  };

  const getEnemyCombatantDomestic = (combatantList, attackerRole) => {
    const enemies = combatantList.filter((agent) =>
      attackerRole === 0 ? agent.role > 0 : agent.role === 0 && agent.alive
    );
    if (enemies.length === 0) return false;
    return enemies[getRandomIntInclusive(0, enemies.length - 1)];
  };

  const damageAgent = async (agentId, min, max) => {
    const agent = gameState.citizens[agentId];
    agent.currentHealth -= getRandomIntInclusive(min, max);
    setGameState({
      ...gameState,
      citizens: { ...gameState.citizens, [agentId]: agent },
    });
  };

  /**
   *
   * @param {*} tile
   * @param {Array} attackers
   * @param {Array} defenders
   */
  const doCombat = (attackers, defenders, domestic = false) => {
    const combatants = attackers.concat(defenders);
    const citizens = Object.assign({}, gameState.citizens);
    const combatLog = [];
    combatants.forEach((combatant) => {
      if (combatant.alive) {
        const target = domestic
          ? getEnemyCombatantDomestic(combatants, combatant.role)
          : getEnemyCombatant(combatants, combatant.nationId);
        if (target) {
          target.currentHealth -= combatant.strength;
          if (target.currentHealth <= 0) {
            target.alive = false;
          }
          const combatLogString = `${combatant.name} attacks ${target.name}`;
          console.log(combatLog);

          citizens[target.id] = target;
          combatLog.push(combatLogString);
        }
      }
    });
    setGameState({
      ...gameState,
      citizens,
    });
    return combatLog;
  };

  /**
   * Execute tile combat between the EoE and other nations
   * @param {*} tile
   */
  const doTileCombat = (tile, attackerId) => {
    const citizens = Object.assign({}, gameState.citizens);
    // Gather combatants
    // const combatants = getAllAgentsOnTile(tile).reduce(
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

    const combatants = getAllAgentsOnTile(tile);
    console.log(combatants);

    // Execute attacks for each character
    // super simple combat for now
    combatants.forEach((combatant) => {
      if (combatant.alive) {
        const target = getEnemyCombatant(combatants, combatant.nationId);
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
    setGameState({
      ...gameState,
      citizens,
    });
  };

  const clearOperations = () => {
    gameState.operations = [];
  };

  const clearIncidents = () => {
    setGameState({
      ...gameState,
      incidents: [],
    });
  };

  const changeTileOwner = (tile, newOwnerId) => {
    tile.setNationId(newOwnerId);
  };
  /**
   * Runs initial game setup
   */
  const setUpGame = async () => {
    // some constants
    const cpuAgentsPerTile = 8;

    const player = Object.assign({}, gameState.player);
    // Create Map
    const gameMap = await makeMap();

    // Create nations to populate the map & set tile ownership
    const { nations, cpuNation, evilEmpire } = await createNations();
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
            const newCitizen = createCitizen(x, y);
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
          const tileCitizens = getCitizensOnTile(tile, citizens);
          for (let a = 0; a < cpuAgentsPerTile; a++) {
            tileCitizens[a].role = 1;
          }
        }
      }
    }

    // Set data
    player.evilEmpire = evilEmpire;
    setGameState({
      ...gameState,
      player,
      nations,
      citizens,
      gameMap,
      gameReady: true,
    });
  };

  return (
    <Provider
      value={{
        gameState,
        setUpGame,
        addOperation,
        changeTileOwner,
        clearOperations,
        createCitizen,
        createNations,
        createSquad,
        disbandSquad,
        doTileCombat,
        getAgents,
        getAllAgentsOnTile,
        getCitizens,
        getCitizensOnTile,
        getCPUAgentsOnTile,
        getCPUNation,
        getEnemyCombatant,
        getEvilAgents,
        getEvilEmpire,
        getFreeSquads,
        getOccupiedSquads,
        getOperations,
        getSelectedTile,
        getSquadlessAgents,
        getSquadlessAgentsOnTile,
        getSquads,
        getSquadsOnTile,
        getTileById,
        selectTile,
        setScreen,
        setGameState,
        setSquadLocation,
        getFormattedDate,
        selectSquad,
        advanceDay,
        getAgentsOnTile,
        getBusyAgents,
        selectAgent,
      }}
    >
      {children}
    </Provider>
  );
};

export { GameDataContext, GameDataProvider };
