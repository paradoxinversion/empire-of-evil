import React, { useContext } from "react";
import Operation from "../Operation";
import { operationTypes } from "../../data/operation";
import { GameDataContext } from "../../context/GameDataContext";

const EmpireOperationsUI = () => {
  const gameDataContext = useContext(GameDataContext);
  return (
    <div>
      <p>Empire Operations</p>
      <div>
        <button
          className="border mr-1"
          onClick={() => gameDataContext.setScreen("empire-organization")}
        >
          Organization
        </button>
        <button
          className="border mr-1"
          onClick={() => gameDataContext.setScreen("empire-research")}
        >
          Research
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

export default EmpireOperationsUI;
