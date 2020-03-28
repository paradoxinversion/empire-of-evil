import React from "react";
import Operation from "../Operation";
import { operationTypes } from "../../data/operation";
import Collapsable from "../Collapsable";
import Squad from "../Squad";
const EmpireOperationsUI = ({ gameManager }) => {
  return (
    <div>
      <p>Empire Operations</p>
      <div>
        <button
          className="border mr-1"
          onClick={() => gameManager.setScreen("empire-organization")}>
          Organization
        </button>
        <button
          className="border mr-1"
          onClick={() => gameManager.setScreen("empire-research")}>
          Research
        </button>
        <button
          className="border mr-1"
          onClick={() => gameManager.setScreen("main")}>
          Back
        </button>
      </div>
      <div>
        <Collapsable title="Current Ops">
          {gameManager.state.operations.map(operation => (
            <div>
              <p>{operation.operationType.name}</p>
              <p>Squads</p>
              {operation.squads.map(squad => (
                <Squad squad={squad} />
              ))}
              <button
                className="border px-1"
                onClick={() => gameManager.cancelOperation(operation.id)}>
                Cancel Operation
              </button>
            </div>
          ))}
        </Collapsable>
      </div>
    </div>
  );
};

export default EmpireOperationsUI;
