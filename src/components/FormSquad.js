import React, { useState } from "react";
import Squads from "./Squads";
import Agent from "./Agent";
import Agents from "./Agents";

const FormSquad = ({ gameManager }) => {
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [squadLeader, setSquadLeader] = useState(null);
  return (
    <div>
      <div>
        <button>Form Squad/Team</button>
      </div>
      <form>
        <p>New Squad/Team</p>
        <label htmlFor="form-squad-name">Squad Name</label>
        <input type="text" />
        <label htmlFor="form-squad-type">Squad Type</label>
        <select id="form-squad-type">
          <option value={0}>Soldiers</option>
          <option value={1}>Researchers</option>
        </select>
        <label htmlFor="form-squad-leader">Squad Leader</label>
        <select
          id="form-squad-leader"
          onChange={e => {
            setSquadLeader(e.target.value);
            setSelectedAgent(null);
          }}
        >
          <option value="">Select a Leader</option>
          {gameManager
            .getSquadlessAgents(
              gameManager.state.citizens,
              gameManager.getEvilEmpire().id
            )
            .filter(
              agent =>
                !selectedAgents.includes(agent.id) && agent.id !== squadLeader
            )
            .map(agent => (
              <option value={agent.id}>{agent.name}</option>
            ))}
        </select>

        <div id="form-squad-members">
          <div className="border">
            {gameManager
              .getSquadlessAgents(
                gameManager.state.citizens,
                gameManager.getEvilEmpire().id
              )
              .filter(
                agent =>
                  !selectedAgents.includes(agent.id) && agent.id !== squadLeader
              )
              .map(agent => (
                <div
                  onClick={() => {
                    setSelectedAgent(agent);
                  }}
                >
                  {agent.name}
                </div>
              ))}
          </div>
          <div>
            <p>Selected Member Info</p>
            {selectedAgent && <Agent agent={selectedAgent} />}
          </div>
          {squadLeader && (
            <React.Fragment>
              <button
                onClick={e => {
                  e.preventDefault();
                  const selectedMembers = selectedAgents.slice(0);
                  selectedMembers.push(selectedAgent.id);
                  setSelectedAgents(selectedMembers);
                  setSelectedAgent(null);
                }}
              >
                Add member
              </button>
              <button
                onClick={e => {
                  e.preventDefault();
                  const selectedMembers = selectedAgents.slice(0);
                  // get the member index
                  const memberIndex = selectedMembers.indexOf(selectedAgent.id);
                  const t = selectedMembers.splice(memberIndex, 1);
                  setSelectedAgents(selectedMembers);
                  setSelectedAgent(null);
                }}
              >
                Remove member
              </button>
              <div className="border">
                {selectedAgents.map(agentId => (
                  <div
                    onClick={() => {
                      setSelectedAgent(gameManager.state.citizens[agentId]);
                    }}
                  >
                    {gameManager.state.citizens[agentId].name}
                  </div>
                ))}
              </div>
            </React.Fragment>
          )}
        </div>

        {squadLeader && (
          <React.Fragment>
            <div id="form-squad-info">
              <p>
                Strength Potential:{" "}
                {selectedAgents.reduce((accumulator, agentId) => {
                  return (
                    accumulator + gameManager.state.citizens[agentId].strength
                  );
                }, 0) + gameManager.state.citizens[squadLeader].strength}
              </p>
              <p>
                Research Potential:{" "}
                {selectedAgents.reduce((accumulator, agentId) => {
                  return (
                    accumulator +
                    gameManager.state.citizens[agentId].intelligence
                  );
                }, 0) +
                  gameManager.state.citizens[squadLeader].intelligence}{" "}
              </p>
            </div>
            <button
              onClick={e => {
                e.preventDefault();

                gameManager.createSquad(
                  gameManager.getEvilEmpire().id,
                  "Testoresto",
                  selectedAgents.concat(squadLeader),
                  squadLeader,
                  0
                );
              }}
            >
              Confirm and Form
            </button>
          </React.Fragment>
        )}
      </form>
    </div>
  );
};

export default FormSquad;
