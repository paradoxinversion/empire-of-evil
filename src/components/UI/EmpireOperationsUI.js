import React from "react";
import Operation from "../Operation";

const EmpireOperationsUI = ({ gameManager }) => {
  return (
    <div>
      <p>Empire Operations</p>
      <div>
        <button
          className="border mr-1"
          onClick={() => gameManager.setScreen("empire-organization")}
        >
          Organization
        </button>
        <button
          className="border mr-1"
          onClick={() => gameManager.setScreen("empire-research")}
        >
          Research
        </button>
        <button
          className="border mr-1"
          onClick={() => gameManager.setScreen("main")}
        >
          Back
        </button>
      </div>
      <div>
        <Operation name="Scout" description="Scout the tile" />
      </div>
    </div>
  );
};

export default EmpireOperationsUI;
