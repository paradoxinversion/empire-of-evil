import React from "react";

const Squad = ({ squad, showDisband, gameManager }) => {
  return (
    <div className="border p-1">
      <div>
        <span className="mr-4">{squad.name}</span>{" "}
        <span className="mr-4">Members: {squad.members.length}</span>
        <span className="mr-4">{squad.leader}</span>
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
