import React from "react";
import Collapsable from "./Collapsable";
import GameManager from "../containers/GameManager";
import connect from "unstated-connect";
import Agent from "./Agent";
const Agents = props => {
  const [GameManager] = props.containers;
  return (
    <Collapsable title="EVIL Agents">
      <Collapsable title="Squadless EVIL Agents">
        {GameManager.state.player.evilEmpire &&
          GameManager.getEvilAgents(
            GameManager.state.citizens,
            GameManager.state.player.evilEmpire.id,
            1
          ).map(agent => <Agent agent={agent} gameManager={GameManager} />)}
      </Collapsable>
      <Collapsable title="Scientists">
        {GameManager.state.player.evilEmpire &&
          GameManager.getEvilAgents(
            GameManager.state.citizens,
            GameManager.state.player.evilEmpire.id,
            2
          ).map(agent => <Agent agent={agent} gameManager={GameManager} />)}
      </Collapsable>
      <Collapsable title="Administrators">
        {GameManager.state.player.evilEmpire &&
          GameManager.getEvilAgents(
            GameManager.state.citizens,
            GameManager.state.player.evilEmpire.id,
            3
          ).map(agent => <Agent agent={agent} gameManager={GameManager} />)}
      </Collapsable>
    </Collapsable>
  );
};

export default connect([GameManager])(Agents);
