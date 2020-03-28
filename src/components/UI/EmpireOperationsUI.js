import React, { useState } from "react";
import Operation from "../Operation";
import { operationTypes } from "../../data/operation";
import { activityTypes } from "../../data/activity";
import Modal from "../Modal";
import Collapsable from "../Collapsable";
import Squad from "../Squad";
import Agent from "../Agent";
import SelectAgents from "../SelectAgents";
const EmpireOperationsUI = ({ gameManager }) => {
  const [modal, setModal] = useState(null);
  return (
    <React.Fragment>
      <React.Fragment>
        {modal && (
          <Modal>
            {/* Operation Modal example */}
            {modal.modalType === "select-agents" && (
              <SelectAgents
                gameManager={gameManager}
                setModalOpen={setModal}
                callback={list => {
                  console.log(list);
                  list.forEach(agentId => {
                    gameManager.setAgentActivity(agentId, modal.activityType);
                  });
                }}
              />
            )}
          </Modal>
        )}
      </React.Fragment>
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
          <div>
            <p>Activitie</p>
            {Object.keys(activityTypes).map(activityTypeKey => (
              <div>
                <p>{activityTypes[activityTypeKey].name}</p>
                <p>{activityTypes[activityTypeKey].description}</p>
                <button
                  className="border px-1"
                  onClick={() => {
                    setModal({
                      modalType: "select-agents",
                      activityType: activityTypeKey
                    });
                  }}>
                  Add agents
                </button>
                <Collapsable title="Agents">
                  {gameManager.state.activities[activityTypeKey] ? (
                    gameManager.state.activities[
                      activityTypeKey
                    ].map(agentId => (
                      <Agent
                        agent={gameManager.state.citizens[agentId]}
                        gameManager={gameManager}
                      />
                    ))
                  ) : (
                    <p>No agents</p>
                  )}
                </Collapsable>
              </div>
            ))}
          </div>
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
    </React.Fragment>
  );
};

export default EmpireOperationsUI;
