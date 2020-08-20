import React, { useContext } from "react";
import { Collapsable } from "../GeneralUse/index";
import { Squad } from "../Tiles/index";
import PropTypes from "prop-types";
import { GameDataContext } from "../../context/GameDataContext";
const Squads = ({ showDisband }) => {
  const gameDataContext = useContext(GameDataContext);
  return (
    <Collapsable title="EVIL Squads and Teams">
      <Collapsable title="Squads">
        {gameDataContext
          .getSquads(gameDataContext.getEvilEmpire().id, 0)
          .map((squad) => (
            <Squad
              key={`squads-${squad.id}`}
              squad={squad}
              showDisband={showDisband}
            />
          ))}
      </Collapsable>
      <Collapsable title="Research Teams">
        {gameDataContext
          .getSquads(gameDataContext.getEvilEmpire().id, 1)
          .map((squad) => (
            <Squad squad={squad} showDisband={showDisband} />
          ))}
      </Collapsable>
    </Collapsable>
  );
};

Squads.propTypes = {
  showDisband: PropTypes.bool,
};

export default Squads;
