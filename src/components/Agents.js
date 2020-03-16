import React from "react";
import Collapsable from "./Collapsable";
import Agent from "./Agent";
import GameManager from "../containers/GameManager";
import connect from "unstated-connect";
const Agents = props => {
  const [GameManager] = props.containers;
  return (
    <Collapsable title="EVIL Agents">
      <Collapsable title="Soldiers">
        {GameManager.state.player.evilEmpire &&
          GameManager.getEvilAgents(
            GameManager.state.citizens,
            GameManager.state.player.evilEmpire.id
          )
            .filter(agent => agent.role === 1)
            .map(agent => (
              <div>
                {agent.name} {agent.id}
              </div>
            ))}
      </Collapsable>
      {/* <Agent agent/> */}
      <h2>Scientists</h2>
      <h2>Adminstrators</h2>
    </Collapsable>
  );
};

export default connect([GameManager])(Agents);
