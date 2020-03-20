import React from "react";

const CommandBar = props => {
  return (
    <span>
      <span className="mr-4">Wed, Nov 1, 2000</span>
      <button className="border p-1 mr-2 rounded">Wait</button>
      <button
        className="border p-1 mr-2 rounded"
        onClick={() => props.gameManager.setScreen("empire")}
      >
        Empire
      </button>
      <button
        className="border p-1 mr-2 rounded"
        onClick={() => props.gameManager.setScreen("agents")}
      >
        Agents
      </button>
    </span>
  );
};

export default CommandBar;
