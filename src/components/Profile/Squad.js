import React, { useState } from "react";
import { Agent } from "../Tiles/index";
import PropTypes from "prop-types";
const Squad = ({ gameManager }) => {
  const squad = gameManager.state.selectedSquad.squadData;
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
        <p>Squad Profile: {squad.name}</p>
        <p>Leader: {gameManager.getCitizens()[squad.leader].name}</p>
        <div>
          <p>Members</p>
          {squad.members.map(squadMemberId => (
            <Agent
              agent={gameManager.state.citizens[squadMemberId]}
              gameManager={gameManager}
            />
          ))}
        </div>
        <button
          className="border px-1 bg-red-700 text-white"
          onClick={() => {
            gameManager.setScreen("empire-organization");
            gameManager.disbandSquad(squad.id);
          }}>
          Disband Squad
        </button>
      </div>
    </React.Fragment>
  );
};
Squad.propTypes = {
  gameManager: PropTypes.object.isRequired
};
export default Squad;
