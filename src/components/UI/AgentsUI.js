import React, { Component } from "react";
import Agents from "../Agents";

const AgentsUI = props => {
  // const [GameManager] = this.props.containers;
  return (
    <React.Fragment>
      <button onClick={() => props.gameManager.setScreen("main")}>Back</button>
      <h1> AgentsUI </h1>
      <Agents />
    </React.Fragment>
  );
};

export default AgentsUI;
