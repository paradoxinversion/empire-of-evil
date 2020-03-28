import React, { useState } from "react";
import { Agent } from "../Tiles/index";
import Faker from "faker";

const FormSquad = ({ gameManager, setModalOpen }) => {
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [squadLeader, setSquadLeader] = useState(null);
  const color = Faker.commerce.color();
  const word = Faker.random.word();
  const [squadName, setSquadName] = useState(
    `${color[0].toUpperCase() + color.slice(1)} ${word[0].toUpperCase() +
      word.slice(1)}`
  );
  const [squadtype, setSquadType] = useState("");
  return (
    <div className="bg-white p-4 w-3/4">
      <form>
        <p className="mb-4">
          <strong>Forming a New Squad/Team</strong>
        </p>
        <div className="mb-2">
          <label className="mr-2" htmlFor="form-squad-name">
            Squad Name
          </label>
          <input
            className="border border-grey-400"
            type="text"
            value={squadName}
            onChange={e => setSquadName(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label className="mr-2" htmlFor="form-squad-type">
            Squad Type
          </label>
          <select
            id="form-squad-type"
            className="border border-gray-400"
            value={squadtype}
            onChange={e => setSquadType(e.target.value)}>
            <option value="">Select Type</option>
            <option value={0}>Soldier Squad</option>
            <option value={1}>Research Team</option>
          </select>
        </div>

        <div className="mb-2">
          {!squadLeader ? (
            <React.Fragment>
              <label className="mr-2" htmlFor="form-squad-leader">
                Squad Leader
              </label>
              <select
                id="form-squad-leader"
                className="border border-gray-400"
                onChange={e => {
                  setSquadLeader(e.target.value);
                  setSelectedAgent(null);
                }}>
                <option value="">Select a Leader</option>
                {gameManager
                  .getSquadlessAgents(gameManager.getEvilEmpire().id)
                  .filter(
                    agent =>
                      !selectedAgents.includes(agent.id) &&
                      agent.id !== squadLeader
                  )
                  .map(agent => (
                    <option key={`leader-select-${agent.id}`} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
              </select>
            </React.Fragment>
          ) : (
            <p>
              Squad Leader is{" "}
              <strong>{gameManager.state.citizens[squadLeader].name}</strong>
              <button
                className="ml-4 border px-2"
                onClick={() => setSquadLeader(null)}>
                Clear Leader
              </button>
            </p>
          )}
        </div>

        <div id="form-squad-members">
          <div className="flex">
            <div className="border w-1/2 p-2">
              {gameManager
                .getSquadlessAgentsOnTile(
                  gameManager.getEvilEmpire().id,

                  gameManager.state.selectedTile
                )
                .filter(
                  agent =>
                    !selectedAgents.includes(agent.id) &&
                    agent.id !== squadLeader
                )
                .map(agent => (
                  <div
                    key={`agent-select-add-${agent.id}`}
                    className="hover:bg-gray-300"
                    onClick={() => {
                      setSelectedAgent(agent);
                    }}>
                    {agent.name}
                  </div>
                ))}
            </div>
            <div className="flex flex-col justify-center">
              <button
                className="border p-1 mx-2 mb-4"
                onClick={e => {
                  e.preventDefault();
                  const selectedMembers = selectedAgents.slice(0);
                  selectedMembers.push(selectedAgent.id);
                  setSelectedAgents(selectedMembers);
                  setSelectedAgent(null);
                }}>
                Add
              </button>
              <button
                className="border p-1 mx-2"
                onClick={e => {
                  e.preventDefault();
                  const selectedMembers = selectedAgents.slice(0);
                  // get the member index
                  const memberIndex = selectedMembers.indexOf(selectedAgent.id);
                  const t = selectedMembers.splice(memberIndex, 1);
                  setSelectedAgents(selectedMembers);
                  setSelectedAgent(null);
                }}>
                Remove
              </button>
            </div>
            <div className="border w-1/2 p-2">
              {selectedAgents.map(agentId => (
                <div
                  key={`agent-select-remove-${agentId}`}
                  className="hover:bg-gray-300"
                  onClick={() => {
                    setSelectedAgent(gameManager.state.citizens[agentId]);
                  }}>
                  {gameManager.state.citizens[agentId].name}
                </div>
              ))}
            </div>
          </div>

          <div id="form-squad-info">
            <span className="mr-4">
              Strength Potential:{" "}
              {selectedAgents.length > 0 || squadLeader
                ? selectedAgents.reduce((accumulator, agentId) => {
                    return (
                      accumulator + gameManager.state.citizens[agentId].strength
                    );
                  }, 0) +
                  (squadLeader
                    ? gameManager.state.citizens[squadLeader].strength
                    : 0)
                : 0}
            </span>
            <span>
              Research Potential:{" "}
              {selectedAgents.length > 0 || squadLeader
                ? selectedAgents.reduce((accumulator, agentId) => {
                    return (
                      accumulator +
                      gameManager.state.citizens[agentId].intelligence
                    );
                  }, 0) +
                  (squadLeader
                    ? gameManager.state.citizens[squadLeader].intelligence
                    : 0)
                : 0}{" "}
            </span>
          </div>

          <div className="border mt-4 mb-2 h-32 p-2">
            <p>Selected Member Info</p>
            {selectedAgent && <Agent agent={selectedAgent} />}
          </div>
        </div>
        <div className="flex justify-between">
          {squadLeader && squadName && squadtype && (
            <React.Fragment>
              <button
                className="border px-1"
                onClick={async e => {
                  e.preventDefault();
                  await gameManager.createSquad(
                    gameManager.getEvilEmpire().id,
                    squadName,
                    selectedAgents.concat(squadLeader),
                    squadLeader,
                    0,
                    gameManager.state.selectedTile.tile
                  );
                  setModalOpen(false);
                }}>
                Confirm and Form
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

export default FormSquad;
