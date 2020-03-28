import React from "react";

const Agent = ({ agent, gameManager, border }) => {
  return (
    <div
      className={`mb-2 hover:bg-gray-300 ${border ? "border" : ""}`}
      onClick={() => {
        gameManager.selectAgent(agent);
        gameManager.setScreen("profile-agent");
      }}>
      <p className="mr-4">
        <strong>{agent.name}</strong>
      </p>{" "}
      <p className="mr-4">
        {agent.squadId !== -1
          ? gameManager.state.squads[agent.squadId].name
          : "No Squad"}
      </p>
      <span className="mr-4">
        HP: {agent.currentHealth}/{agent.health}
      </span>
      <span className="mr-4">EXP: {agent.experiencePoints}</span>
    </div>
  );
};

export default Agent;
