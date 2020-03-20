import React from "react";

const Agent = ({ agent, gameManager }) => {
  return (
    <div className="border p-1">
      <div>
        <span className="mr-4">{agent.name}</span>{" "}
        <span className="mr-4">HP: {agent.currentHealth}</span>
        <span className="mr-4">
          {agent.squadId !== -1
            ? gameManager.state.squads[agent.squadId].name
            : "No Squad"}
        </span>
        <span className="mr-4">EXP: {agent.experiencePoints}</span>
      </div>
    </div>
  );
};

export default Agent;
