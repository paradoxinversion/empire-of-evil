const { getUID } = require("../../utilities");

/**
 * Dead citizens (ie, alive = false) are considered to be 'in the morgue'.
 * @param {Object} param0 - Agent Parameters
 * @param {string} param0.name - Agent name
 * @param {number} param0.strength - Agent strength
 * @param {number} param0.intelligence - Agent intelligence
 * @param {number} param0.administration - Agent administration
 * @param {string} param0.role - Agent role
 */
class Citizen {
  constructor({
    name,
    strength,
    intelligence,
    administration,
    role,
    x,
    y,
    nationId
  }) {
    this.id = getUID();
    this.name = name;
    this.strength = strength;
    this.intelligence = intelligence;
    this.administration = administration;
    this.health = 10 + strength;
    this.currentHealth = this.health;
    this.role = role;
    this.squadId = -1;
    this.nationId = nationId;
    this.alive = true;
    this.nationalLoyalty = 25;
    this.currentPosition = {
      x,
      y
    };
    this.experiencePoints = 0;
    this.conviction = 0;
  }

  setNationId(id) {
    this.nationId = id;
  }
  setSquadId(squadId) {
    this.squadId = squadId;
  }
}

const agentRoles = {
  recruit: ["recruit"],
  soldier: ["grunt"],
  scientist: ["researcher"],
  administrator: ["intern"],
  civillian: ["civillian"]
};

const agentTestOptions = {
  name: "Test Agent",
  strength: 5,
  intelligence: 6,
  administration: 7,
  role: agentRoles.recruit[0]
};
module.exports = {
  Citizen,
  agentRoles
};
