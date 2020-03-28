import React, { useState } from "react";
import Collapsable from "../Collapsable";
import Squad from "../Squad";

const Agent = ({ gameManager }) => {
  const agent = gameManager.state.selectedAgent.agentData;
  return (
    <React.Fragment>
      <div>
        <button
          onClick={() => {
            gameManager.setScreen("main");
          }}>
          to main
        </button>
        <button
          onClick={() => {
            gameManager.setScreen("empire-organization");
          }}>
          empire organization
        </button>
      </div>
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
            {gameManager.getAgentActivity(agent.id)
              ? gameManager.getAgentActivity(agent.id)
              : "No Activity"}
          </p>
          <p>Squad</p>
          {agent.squadId !== -1 ? (
            <Squad
              squad={gameManager.state.squads[agent.squadId]}
              gameManager={gameManager}
            />
          ) : (
            <p>Not in a squad</p>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Agent;
