const { getUID } = require("../utilities");

const agentRoles = {
  recruit: ["recruit"],
  soldier: ["grunt"],
  scientist: ["researcher"],
  administrator: ["intern"]
};

const agentTestOptions = {
  name: "Test Agent",
  strength: 5,
  intelligence: 6,
  administration: 7,
  role: agentRoles.recruit[0]
};

/**
 *
 * @param {Object} param0 - Agent Parameters
 * @param {string} param0.name - Agent name
 * @param {number} param0.strength - Agent strength
 * @param {number} param0.intelligence - Agent intelligence
 * @param {number} param0.administration - Agent administration
 * @param {string} param0.role - Agent role
 */
const createAgent = ({
  name,
  strength,
  intelligence,
  administration,
  role
}) => {
  const newAgent = {
    id: getUID(),
    name,
    health: 10 + strength,
    strength,
    intelligence,
    administration,
    role,
    squadId: -1,
    nationId: -1
  };
  console.log(newAgent);
  return newAgent;
};
