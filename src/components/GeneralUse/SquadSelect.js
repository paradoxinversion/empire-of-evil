import React, { useState, useContext } from "react";
import Squad from "./Squad";
import { GameDataContext } from "../context/GameDataContext";
import { Squad } from "../Tiles/index";

const SquadSelect = ({ selectedSquads, setSelectedSquads }) => {
  const gameDataContext = useContext(GameDataContext);
  // const [selectedSquads, setSelectedSquads] = useState([]);
  const [selectedSquad, setSelectedSquad] = useState(null);
  const addSquad = (squad) => {
    const squads = selectedSquads.slice(0);
    squads.push(squad);
    setSelectedSquads(squads);
  };
  const removeSquad = (squadToRemove) => {
    const squads = selectedSquads.slice(0);
    const squadIndex = selectedSquads.findIndex(
      (squad) => (squad.id = squadToRemove.id)
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
        <div id="operation-squad-select" className="flex mb-2">
          <div id="operation-free-squads" className="border w-1/2 p-2">
            {gameDataContext
              .getFreeSquads(gameDataContext.getEvilEmpire().id)
              .filter((squad) => !selectedSquads.includes(squad))
              .map((squad) => (
                <div
                  onClick={() => {
                    setSelectedSquad(squad);
                  }}
                >
                  {squad.name}
                </div>
              ))}
          </div>
          <div className="flex flex-col justify-center">
            <button
              className="disabled:cursor-not-allowed border p-1 mx-2 mb-4"
              onClick={(e) => {
                e.preventDefault();
                addSquad(selectedSquad);
              }}
              disabled={!!!selectedSquad}
            >
              Add
            </button>
            <button
              className="disabled:cursor-not-allowed border p-1 mx-2"
              onClick={(e) => {
                e.preventDefault();
                removeSquad(selectedSquad);
              }}
              disabled={!!!selectedSquad}
            >
              Remove
            </button>
          </div>
          <div id="operation-free-squads" className="border w-1/2 p-2">
            {selectedSquads.map((squad) => (
              <div
                onClick={() => {
                  setSelectedSquad(squad);
                }}
              >
                {squad.name}
              </div>
            ))}
          </div>
        </div>
        <div className="h-16 mb-4">
          <p>Selected Squad Info</p>
          {selectedSquad && <Squad squad={selectedSquad} />}
        </div>
      </form>
    </div>
  );
};

export default SquadSelect;
