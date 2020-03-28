import React from "react";

const Squad = ({ squad, showDisband, gameManager }) => {
  return (
    <div
      className="border p-1"
      onClick={() => {
        gameManager.selectSquad(squad);
        gameManager.setScreen("profile-squad");
      }}>
      <div>
        <p className="mr-4">
          <strong>{squad.name}</strong>
        </p>{" "}
        <span className="mr-4">Members: {squad.members.length}</span>
        {showDisband && (
          <button onClick={() => gameManager.disbandSquad(squad.id)}>
            Disband
          </button>
        )}
      </div>
    </div>
  );
};

export default Squad;
