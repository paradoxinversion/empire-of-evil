import React, { useState, useContext } from "react";
import { Agent } from "../Tiles/index";
import PropTypes from "prop-types";
import { GameDataContext } from "../../context/GameDataContext";

const Squad = () => {
  const gameDataContext = useContext(GameDataContext);
  const [squad, setSquad] = useState(
    gameDataContext.gameState.selectedSquad
      ? gameDataContext.gameState.selectedSquad.squadData
      : null
  );
  if (squad) {
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
        <div>
          <p>Squad Profile: {squad.name}</p>
          <p>Leader: {gameDataContext.getCitizens()[squad.leader].name}</p>
          <div>
            <p>Members</p>
            {squad.members.map((squadMemberId) => (
              <Agent
                agent={gameDataContext.gameState.citizens[squadMemberId]}
                gameDataContext={gameDataContext}
              />
            ))}
          </div>
          <button
            className="border px-1 bg-red-700 text-white"
            onClick={() => {
              gameDataContext.setScreen("empire-organization");
              gameDataContext.disbandSquad(squad.id);
            }}
          >
            Disband Squad
          </button>
        </div>
      </React.Fragment>
    );
  }

  return <p>No Squad Selected</p>;
};
Squad.propTypes = {
  gameDataContext: PropTypes.object.isRequired,
};
export default Squad;
