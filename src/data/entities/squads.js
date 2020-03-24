const { getUID } = require("../../utilities");

class Squad {
  constructor({ name, members, leader, role, nationId, x, y }) {
    this.id = getUID();
    this.name = name;
    this.members = members;
    this.leader = leader;
    this.role = role;
    this.nationId = nationId;
    this.currentPosition = {
      x,
      y
    };
  }
}

module.exports = {
  Squad
};
