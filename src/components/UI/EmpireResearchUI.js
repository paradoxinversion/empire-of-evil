import React from "react";

const EmpireResearchUI = ({ gameManager }) => {
  return (
    <div>
      <p>Empire Research</p>
      <div>
        <button
          className="border mr-1"
          onClick={() => gameManager.setScreen("empire-organization")}
        >
          Organization
        </button>
        <button
          className="border mr-1"
          onClick={() => gameManager.setScreen("empire-operations")}
        >
          Operations
        </button>
        <button
          className="border mr-1"
          onClick={() => gameManager.setScreen("main")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default EmpireResearchUI;
