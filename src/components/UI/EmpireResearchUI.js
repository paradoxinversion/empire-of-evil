import React, { useContext } from "react";
import { GameDataContext } from "../../context/GameDataContext";

const EmpireResearchUI = () => {
  const gameDataContext = useContext(GameDataContext);
  return (
    <div>
      <p>Empire Research</p>
      <div>
        <button
          className="border mr-1"
          onClick={() => gameDataContext.setScreen("empire-organization")}
        >
          Organization
        </button>
        <button
          className="border mr-1"
          onClick={() => gameDataContext.setScreen("empire-operations")}
        >
          Operations
        </button>
        <button
          className="border mr-1"
          onClick={() => gameDataContext.setScreen("main")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default EmpireResearchUI;
