import React, { Component, useContext } from "react";
import { Agents } from "../TileGroups/index";
import { GameDataContext } from "../../context/GameDataContext";
import PropTypes from "prop-types";
const AgentsUI = (props) => {
  const gameDataContext = useContext(GameDataContext);
  return (
    <React.Fragment>
      <button onClick={() => gameDataContext.setScreen("main")}>Back</button>
      <h1> AgentsUI </h1>
      <Agents />
    </React.Fragment>
  );
};

AgentsUI.propTypes = {};

export default AgentsUI;
