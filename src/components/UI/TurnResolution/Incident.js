import React, { useEffect, useState } from "react";
import { Modal } from "../../GeneralUse/index";
import PropTypes from "prop-types";
import { GameDataContext } from "../../../context/GameDataContext";
const Incident = ({ currentGameEvent, next }) => {
  const gameDataContext = useContext(GameDataContext);
  const [log, setLog] = useState([]);
  useEffect(() => {
    // damage the participant
    switch (currentGameEvent.gameEventData.eventType) {
      case "damage-agent": {
        gameDataContext.damageAgent(
          currentGameEvent.target.id,
          currentGameEvent.gameEventData.amount[0],
          currentGameEvent.gameEventData.amount[1]
        );

        break;
      }
      case "gain-agent": {
        gameDataContext.convertTileCitizenToAgent(
          gameDataContext.getRandomNationTile(
            gameDataContext.getEvilEmpire().id
          )
        );
        break;
      }
      case "combat": {
        const attackers = gameDataContext.getRandomCitizensOnTile(
          gameDataContext.getTileByCoordinates(
            currentGameEvent.target.currentPosition.x,
            currentGameEvent.target.currentPosition.y
          ),
          3
        );
        const defenders = [currentGameEvent.target];
        const combatLog = gameDataContext.doCombat(attackers, defenders, true);
        setLog(combatLog);
        break;
      }
      default: {
        console.log("unhandled event type");
        break;
      }
    }
  }, [gameDataContext]);
  return (
    <Modal>
      <div className="bg-white w-1/4 p-4">
        <p>{currentGameEvent.gameEventData.name}</p>
        <p>{currentGameEvent.gameEventData.description}</p>
        <div className="p-2">
          {currentGameEvent.gameEventData.eventType === "combat" &&
            log.map((logEntry, logEntryIndex) => (
              <p key={`log-entry-${logEntryIndex}`}>{logEntry}</p>
            ))}
        </div>
        <button onClick={() => next()}>Next</button>
      </div>
    </Modal>
  );
};

Incident.propTypes = {
  currentGameEvent: PropTypes.object.isRequired,
  next: PropTypes.object.isRequired,
};

export default Incident;
