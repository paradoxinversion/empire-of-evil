import React, { useState, useContext } from "react";
import { operationTypes } from "../data/operation";
import { GameDataContext } from "../context/GameDataContext";
import { SquadSelect } from "../GeneralUse";

const Operation = ({ operation, setModalOpen }) => {
  const gameDataContext = useContext(GameDataContext);
  const [selectedSquads, setSelectedSquads] = useState([]);
  return (
    <div className="fixed top-0 left-0 bg-gray-600 h-screen w-screen flex justify-center items-center">
      <div id="operation-scout" className="absolute border bg-white p-4">
        <p>Operation: {operation.name}</p>
        <p>{operation.description}</p>
        <p>Max Squads: {operation.maxSquads || "Unlimited"}</p>
        <p>Squad Member Limit: {operation.squadMemberLimit || "Unlimited"}</p>
        <SquadSelect
          selectedSquads={selectedSquads}
          setSelectedSquads={setSelectedSquads}
        />
        {selectedSquads.length > 0 && (
          <button
            className="border rounded p-1"
            onClick={() => {
              // ! Defaulting targetid
              gameDataContext.addOperation(operation, selectedSquads);
              setModalOpen(false);
            }}
          >
            Prepare Mission
          </button>
        )}
        <button
          className="border rounded p-1"
          onClick={() => setModalOpen(false)}
        >
          Close Modal
        </button>
      </div>
    </div>
  );
};

export default Operation;
