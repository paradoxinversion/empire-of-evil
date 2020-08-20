import React, { useContext } from "react";
import Collapsable from "./Collapsable";
import connect from "unstated-connect";
import Agent from "./Agent";
import { GameDataContext } from "../context/GameDataContext";
const Agents = (props) => {
  const gameDataContext = useContext(GameDataContext);
  return (
    <Collapsable title="EVIL Agents">
      <div className="h-64 overflow-y-scroll">
        {gameDataContext.gameState.player.evilEmpire &&
          gameDataContext
            .getEvilAgents(1)
            .map((agent) => <Agent agent={agent} />)}
      </div>
    </Collapsable>
  );
};

export default Agents;
