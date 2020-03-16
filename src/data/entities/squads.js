const { getUID } = require("../utilities");
const { getUID } = require("../../utilities");

class Squad {
  constructor({ name, members, leader }) {
    this.id = getUID();
    this.name = name;
    this.members = members;
    this.leader = leader;
  }
}
/**
 * Form a new squas
 * @param {String} name - the new squad's name
 * @param {Array} members - an array of agent ids, including squad leader
 * @param {String} leader - the id of the squad leader
 */
const createSquad = (name, members, leader) => {
  const squad = {
    name,
    members, //array of integers?
    leader //id
  };
  const newSquad = new Squad(squad);
  return squad;
};
module.exports = {
  Squad,
  formSquad
};
