import React from "react";

const CommandBar = props => {
  return (
    <div className="border">
      <span>Wed, Nov 1, 2000</span>
      <button>Wait</button>
      <button onClick={() => props.gameManager.setScreen("empire")}>
        Empire
      </button>
      <button onClick={() => props.gameManager.setScreen("agents")}>
        Agents
      </button>
    </div>
  );
};

export default CommandBar;
