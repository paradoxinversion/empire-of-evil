import React from "react";
const CommandBar = ({ gameManager }) => {
  return (
    <div id="command-bar" className="mb-2">
      <span className="mr-4">{gameManager.getFormattedDate()}</span>
      <button
        className="border px-1 mr-2 rounded"
        onClick={() => gameManager.waitAndExecuteOperations()}>
        Wait
      </button>
      <button
        className="border px-1 mr-2 rounded"
        onClick={() => gameManager.setScreen("empire")}>
        Empire
      </button>
      <button
        className="border px-1 mr-2 rounded"
        onClick={() => gameManager.setScreen("agents")}>
        Agents
      </button>
      <button onClick={() => gameManager.saveGame()}>Save Game</button>
    </div>
  );
};

export default CommandBar;
