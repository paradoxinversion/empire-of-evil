import React, { Component } from "react";

const Empire = props => {
  // const [GameManager] = this.props.containers;
  return (
    <React.Fragment>
      <button onClick={() => props.gameManager.setScreen("main")}>Back</button>
      <h1> Empire </h1>
      <p>EVIL: {1}</p>
      <p>Cash: {1}</p>
    </React.Fragment>
  );
};

export default Empire;
