import React from "react";
import Collapsable from "./Collapsable";
import GameManager from "../containers/GameManager";
import connect from "unstated-connect";
import Squad from "./Squad";
const Squads = props => {
  const [GameManager] = props.containers;
  return (
    <Collapsable title="EVIL Squads and Teams">
      <Collapsable title="Squads">
        {GameManager.getSquads(
          GameManager.state.squads,
          GameManager.getEvilEmpire().id,
          0
        ).map(squad => (
          <Squad squad={squad} />
        ))}
      </Collapsable>
      <Collapsable title="Research Teams">
        {GameManager.getSquads(
          GameManager.state.squads,
          GameManager.getEvilEmpire().id,
          1
        ).map(squad => (
          <Squad squad={squad} />
        ))}
      </Collapsable>
    </Collapsable>
  );
};

export default connect([GameManager])(Squads);
