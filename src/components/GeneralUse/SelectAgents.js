import React, { useState, useContext } from "react";
import { Agent } from "../Tiles/index";
import { GameDataContext } from "../../context/GameDataContext";

/**
 * Select agents to do a thing
 * @param {*} param0
 */
const SelectAgents = ({ setModalOpen, callback }) => {
  const gameDataContext = useContext(GameDataContext);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);

  return (
    <div className="bg-white p-4 w-3/4">
      <form>
        <div id="form-squad-members">
          <div className="flex">
            <div className="border w-1/2 p-2">
              {gameDataContext
                .getEvilAgents()
                .filter(
                  (agent) =>
                    !gameDataContext.getBusyAgents().includes(agent.id) &&
                    !selectedAgents.includes(agent.id)
                )
                .map((agent) => (
                  <div
                    key={`agent-select-add-${agent.id}`}
                    className="hover:bg-gray-300"
                    onClick={() => {
                      setSelectedAgent(agent);
                    }}
                  >
                    {agent.name}
                  </div>
                ))}
            </div>

            <div className="flex flex-col justify-center">
              <button
                className="border p-1 mx-2 mb-4"
                onClick={(e) => {
                  e.preventDefault();
                  const selectedMembers = selectedAgents.slice(0);
                  selectedMembers.push(selectedAgent.id);
                  setSelectedAgents(selectedMembers);
                  setSelectedAgent(null);
                }}
              >
                Add
              </button>
              <button
                className="border p-1 mx-2"
                onClick={(e) => {
                  e.preventDefault();
                  const selectedMembers = selectedAgents.slice(0);
                  // get the member index
                  const memberIndex = selectedMembers.indexOf(selectedAgent.id);
                  const t = selectedMembers.splice(memberIndex, 1);
                  setSelectedAgents(selectedMembers);
                  setSelectedAgent(null);
                }}
              >
                Remove
              </button>
            </div>
            <div className="border w-1/2 p-2">
              {selectedAgents.map((agentId) => (
                <div
                  key={`agent-select-remove-${agentId}`}
                  className="hover:bg-gray-300"
                  onClick={() => {
                    setSelectedAgent(
                      gameDataContext.gameState.citizens[agentId]
                    );
                  }}
                >
                  {gameDataContext.gameState.citizens[agentId].name}
                </div>
              ))}
            </div>
          </div>

          <div className="border mt-4 mb-2 h-32 p-2">
            <p>Selected Agent Info</p>
            {selectedAgent && <Agent agent={selectedAgent} />}
          </div>
        </div>
        <div className="flex justify-between">
          {selectedAgents.length > 0 && (
            <React.Fragment>
              <button
                className="border px-1"
                onClick={async (e) => {
                  e.preventDefault();
                  callback(selectedAgents);
                  setModalOpen(false);
                }}
              >
                Confirm
              </button>
            </React.Fragment>
          )}
          <button className="border px-1" onClick={() => setModalOpen(false)}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default SelectAgents;
