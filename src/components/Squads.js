import React, { useContext } from "react";
import Collapsable from "./Collapsable";

import Squad from "./Squad";
import { GameDataContext } from "../context/GameDataContext";
const Squads = (props) => {
  const gameDataContext = useContext(GameDataContext);
  return (
    <Collapsable title="EVIL Squads and Teams">
      <Collapsable title="Squads">
        {gameDataContext
          .getSquads(gameDataContext.getEvilEmpire().id, 0)
          .map((squad) => (
            <Squad squad={squad} />
          ))}
      </Collapsable>
      <Collapsable title="Research Teams">
        {gameDataContext
          .getSquads(gameDataContext.getEvilEmpire().id, 1)
          .map((squad) => (
            <Squad squad={squad} />
          ))}
      </Collapsable>
    </Collapsable>
  );
};

export default Squads;
