import React, { useContext } from "react";
import { GameDataContext } from "../../context/GameDataContext";

const Squad = ({ squad, showDisband }) => {
  const gameDataContext = useContext(GameDataContext);
  return (
    <div
      className="border p-1"
      onClick={() => {
        // gameDataContext.setScreen("profile-squad");
        gameDataContext.selectSquad(squad, true);
      }}
    >
      <div>
        <p className="mr-4">
          <strong>{squad.name}</strong>
        </p>{" "}
        <span className="mr-4">Members: {squad.members.length}</span>
        {showDisband && (
          <button onClick={() => gameDataContext.disbandSquad(squad.id)}>
            Disband
          </button>
        )}
      </div>
    </div>
  );
};

export default Squad;
