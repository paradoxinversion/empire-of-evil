import React from "react";
import Collapsable from "./Collapsable";
import GameManager from "../containers/GameManager";
import connect from "unstated-connect";
import Agent from "./Agent";
const Agents = props => {
  const [GameManager] = props.containers;
  return (
    <Collapsable title="EVIL Agents">
      <div className="h-64 overflow-y-scroll">
        {GameManager.state.player.evilEmpire &&
          GameManager.getEvilAgents(1).map(agent => (
            <Agent agent={agent} gameManager={GameManager} />
          ))}
      </div>
    </Collapsable>
  );
};

export default connect([GameManager])(Agents);
