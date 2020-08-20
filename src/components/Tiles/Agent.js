import React, { useContext } from "react";
import { GameDataContext } from "../../context/GameDataContext";

const Agent = ({ agent, border }) => {
  const gameDataContext = useContext(GameDataContext);
  return (
    <div
      className={`mb-2 hover:bg-gray-300 ${border ? "border" : ""}`}
      onClick={() => {
        gameDataContext.selectAgent(agent);
        gameDataContext.setScreen("profile-agent");
      }}
    >
      <p className="mr-4">
        <strong>{agent.name}</strong>
      </p>{" "}
      <p className="mr-4">
        {agent.squadId !== -1
          ? gameDataContext.gameState.squads[agent.squadId].name
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
