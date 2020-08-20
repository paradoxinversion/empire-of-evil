import React, { useContext } from "react";
import Operation from "../Operation";
import { operationTypes } from "../../data/operation";
import { GameDataContext } from "../../context/GameDataContext";
import React, { useState } from "react";
import { activityTypes } from "../../data/gameEvents/activity";
import { Collapsable, Modal } from "../GeneralUse";
import { Agent, Squad } from "../Tiles/index";
import { SelectAgents } from "../GeneralUse/index";

const EmpireOperationsUI = ({ gameDataContext }) => {
  const gameDataContext = useContext(GameDataContext);
  const [modal, setModal] = useState(null);
  return (
    <React.Fragment>
      <React.Fragment>
        {modal && (
          <Modal>
            {/* Operation Modal example */}
            {modal.modalType === "select-agents" && (
              <SelectAgents
                setModalOpen={setModal}
                callback={async (list) => {
                  for (let x = 0; x < list.length; x++) {
                    await gameDataContext.setAgentActivity(
                      list[x],
                      modal.activityType
                    );
                  }
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
        <div>
          <div>
            <p>Activities</p>
            {Object.keys(activityTypes).map((activityTypeKey) => (
              <div>
                <p>{activityTypes[activityTypeKey].name}</p>
                <p>{activityTypes[activityTypeKey].description}</p>
                <button
                  className="border px-1"
                  onClick={() => {
                    setModal({
                      modalType: "select-agents",
                      activityType: activityTypeKey,
                    });
                  }}
                >
                  Add agents
                </button>
                <Collapsable title="Agents">
                  {gameDataContext.gameState.activities[activityTypeKey] ? (
                    gameDataContext.gameState.activities[
                      activityTypeKey
                    ].map((agentId) => (
                      <Agent
                        agent={gameDataContext.gameState.citizens[agentId]}
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
            {gameDataContext.gameState.operations.map((operation) => (
              <div>
                <p>{operation.gameEventData.name}</p>
                <p>Squads</p>
                {operation.squads.map((squad) => (
                  <Squad squad={squad} />
                ))}
                <button
                  className="border px-1"
                  onClick={() => gameDataContext.cancelOperation(operation.id)}
                >
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
