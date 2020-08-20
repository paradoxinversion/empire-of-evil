import React, { useContext } from "react";
import { Collapsable } from "../GeneralUse/index";
import connect from "unstated-connect";
import { Agent } from "../Tiles";
import PropTypes from "prop-types";
import { GameDataContext } from "../../context/GameDataContext";
const Agents = () => {
  const gameDataContext = useContext(GameDataContext);
  return (
    <Collapsable title="EVIL Agents">
      <div className="h-64 overflow-y-scroll">
        {gameDataContext.gameState.player.evilEmpire &&
          gameDataContext
            .getEvilAgents(1)
            .map((agent) => <Agent key={`agent-${agent.id}`} agent={agent} />)}
      </div>
    </Collapsable>
  );
};
Agents.propTypes = {};
export default Agents;
