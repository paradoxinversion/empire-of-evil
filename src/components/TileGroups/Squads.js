import React from "react";
import { Collapsable } from "../GeneralUse/index";
import { Squad } from "../Tiles/index";
import PropTypes from "prop-types";
const Squads = ({ gameManager, showDisband }) => {
  return (
    <Collapsable title="EVIL Squads and Teams">
      <Collapsable title="Squads">
        {gameManager.getSquads(gameManager.getEvilEmpire().id, 0).map(squad => (
          <Squad
            squad={squad}
            showDisband={showDisband}
            gameManager={gameManager}
          />
        ))}
      </Collapsable>
      <Collapsable title="Research Teams">
        {gameManager.getSquads(gameManager.getEvilEmpire().id, 1).map(squad => (
          <Squad
            squad={squad}
            showDisband={showDisband}
            gameManager={gameManager}
          />
        ))}
      </Collapsable>
    </Collapsable>
  );
};

Squads.propTypes = {
  gameManager: PropTypes.object.isRequired,
  showDisband: PropTypes.bool
};

export default Squads;
