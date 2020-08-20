import React, { Component, useContext } from "react";
import { Agents } from "../TileGroups/index";
import { GameDataContext } from "../../context/GameDataContext";

const AgentsUI = (props) => {
  const gameDataContext = useContext(GameDataContext);
  return (
    <React.Fragment>
      <button onClick={() => gameDataContext.setScreen("main")}>Back</button>
      <h1> AgentsUI </h1>
      <Agents gameManager={gameManager} />
    </React.Fragment>
  );
};

AgentsUI.propTypes = {
  gameManager: PropTypes.object,
};

export default AgentsUI;
