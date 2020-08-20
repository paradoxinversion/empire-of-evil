import React, { Component, useContext } from "react";
import Agents from "../Agents";
import { GameDataContext } from "../../context/GameDataContext";

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

export default AgentsUI;
