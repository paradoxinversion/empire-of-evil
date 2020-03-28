import React from "react";
import Collapsable from "./Collapsable";
import GameManager from "../containers/GameManager";
import connect from "unstated-connect";
import Agent from "./Agent";
import PropTypes from "prop-types";
const Agents = ({ gameManager }) => {
  return (
    <Collapsable title="EVIL Agents">
      <div className="h-64 overflow-y-scroll">
        {gameManager.state.player.evilEmpire &&
          gameManager
            .getEvilAgents(1)
            .map(agent => (
              <Agent
                key={`agent-${agent.id}`}
                agent={agent}
                gameManager={gameManager}
              />
            ))}
      </div>
    </Collapsable>
  );
};
Agents.propTypes = {
  gameManager: PropTypes.object.isRequired
};
export default connect([GameManager])(Agents);
