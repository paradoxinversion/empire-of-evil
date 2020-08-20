import React, { useContext } from "react";
import { GameDataContext } from "../context/GameDataContext";

const CommandBar = () => {
  const gameDataContext = useContext(GameDataContext);
  return (
    <div id="command-bar" className="mb-2">
      <span className="mr-4">{gameManager.getFormattedDate()}</span>
      <button
        className="border px-1 mr-2 rounded"
        onClick={() => gameDataContext.waitAndExecuteOperations()}
      >
        Wait
      </button>
      <button
        className="border px-1 mr-2 rounded"
        onClick={() => gameDataContext.setScreen("empire")}
      >
        Empire
      </button>
      <button
        className="border px-1 mr-2 rounded"
        onClick={() => gameDataContext.setScreen("agents")}
      >
        Agents
      </button>
      <button onClick={() => gameManager.saveGame()}>Save Game</button>
    </div>
  );
};

export default CommandBar;
