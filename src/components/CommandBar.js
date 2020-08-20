import React, { useContext } from "react";
import { GameDataContext } from "../context/GameDataContext";

const CommandBar = () => {
  const gameDataContext = useContext(GameDataContext);
  return (
    <div id="command-bar" className="mb-2">
      <span className="mr-4">Wed, Nov 1, 2000</span>
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
    </div>
  );
};

export default CommandBar;
