import React from "react";
import Agents from "../Agents";
import PropTypes from "prop-types";

const AgentsUI = ({ gameManager }) => {
  return (
    <React.Fragment>
      <button onClick={() => gameManager.setScreen("main")}>Back</button>
      <h1> AgentsUI </h1>
      <Agents gameManager={gameManager} />
    </React.Fragment>
  );
};

AgentsUI.propTypes = {
  gameManager: PropTypes.object
};

export default AgentsUI;
