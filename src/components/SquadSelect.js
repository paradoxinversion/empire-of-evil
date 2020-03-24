import React, { useState } from "react";

const SquadSelect = ({ gameManager, selectedSquads, setSelectedSquads }) => {
  // const [selectedSquads, setSelectedSquads] = useState([]);
  const addSquad = squad => {
    const squads = selectedSquads.slice(0);
    squads.push(squad);
    setSelectedSquads(squads);
  };
  const removeSquad = squadToRemove => {
    const squads = selectedSquads.slice(0);
    const squadIndex = selectedSquads.findIndex(
      squad => (squad.id = squadToRemove.id)
    );
    squads.splice(squadIndex, 1);
    setSelectedSquads(squads);
  };
  return (
    <div>
      <div>
        <button>Select Squads/Teams</button>
      </div>
      <form>
        <div id="operation-squad-select">
          <div id="operation-free-squads" className="border">
            {gameManager
              .getFreeSquads(gameManager.getEvilEmpire().id)
              .filter(squad => !selectedSquads.includes(squad))
              .map(squad => (
                <div
                  onClick={() => {
                    addSquad(squad);
                  }}
                >
                  {squad.name}
                </div>
              ))}
          </div>

          <div id="operation-free-squads" className="border">
            {selectedSquads.map(squad => (
              <div
                onClick={() => {
                  removeSquad(squad);
                }}
              >
                {squad.name}
              </div>
            ))}
          </div>
          <div>
            <p>Selected Squad Info</p>
            <p>[info here]</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SquadSelect;
