import React from "react";
import Collapsable from "./Collapsable";
import GameManager from "../containers/GameManager";
import connect from "unstated-connect";
import Squad from "./Squad";
const Squads = props => {
  return (
    <Collapsable title="EVIL Squads and Teams">
      <Collapsable title="Squads">
        {props.gameManager
          .getSquads(props.gameManager.getEvilEmpire().id, 0)
          .map(squad => (
            <Squad squad={squad} />
          ))}
      </Collapsable>
      <Collapsable title="Research Teams">
        {props.gameManager
          .getSquads(props.gameManager.getEvilEmpire().id, 1)
          .map(squad => (
            <Squad squad={squad} />
          ))}
      </Collapsable>
    </Collapsable>
  );
};

export default Squads;
