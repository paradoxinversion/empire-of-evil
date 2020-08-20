import React, { useContext, useState } from "react";
import { Squad } from "../Tiles/index";
import { GameDataContext } from "../../context/GameDataContext";

const Agent = () => {
  const gameDataContext = useContext(GameDataContext);
  const [agent, setAgent] = useState(
    gameDataContext.gameState.selectedAgent
      ? gameDataContext.gameState.selectedAgent.agentData
      : null
  );
  return (
    <React.Fragment>
      <div>
        <button
          onClick={() => {
            gameDataContext.setScreen("main");
          }}
        >
          to main
        </button>
        <button
          onClick={() => {
            gameDataContext.setScreen("empire-organization");
          }}
        >
          empire organization
        </button>
      </div>
      {agent ? (
        <div>
          <p>Agent Profile: {agent.name}</p>
          <p>Status: {agent.alive ? "ALIVE" : "DECEASED"}</p>
          <p>Experience: {agent.experiencePoints}</p>
          <div>
            <p>
              Health: {agent.currentHealth}/{agent.health}
            </p>
            <p>Strength: {agent.strength}</p>
            <p>Intelligence: {agent.intelligence}</p>
            <p>Administration: {agent.administration}</p>
          </div>
          <div>
            <p>
              {gameDataContext.getAgentActivity(agent.id)
                ? gameDataContext.getAgentActivity(agent.id)
                : "No Activity"}
            </p>
            <p>Squad</p>
            {agent.squadId !== -1 ? (
              <Squad squad={gameDataContext.gameState.squads[agent.squadId]} />
            ) : (
              <p>Not in a squad</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p>No Agent Selected</p>
        </div>
      )}
    </React.Fragment>
  );
};

export default Agent;
