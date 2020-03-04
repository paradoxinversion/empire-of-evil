const { getUID } = require("../utilities");

const formSquad = ({ name, members, leader }) => {
  const squad = {
    id: getUID(),
    name,
    members, //array of integers?
    leader //id
  };
  return squad;
};
