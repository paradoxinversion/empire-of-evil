import React, { useEffect, useState } from "react";
import { Modal } from "../../GeneralUse/index";
import { getRandomIntInclusive } from "../../../commonUtilities/commonUtilities";
const Incident = ({ gameManager, currentGameEvent, next }) => {
  const [log, setLog] = useState([]);
  useEffect(() => {
    // damage the participant
    switch (currentGameEvent.gameEventData.eventType) {
      case "damage-agent":
        gameManager.damageAgent(
          currentGameEvent.target.id,
          currentGameEvent.gameEventData.amount[0],
          currentGameEvent.gameEventData.amount[1]
        );

        break;
      case "gain-agent":
        gameManager.convertTileCitizenToAgent(
          gameManager.getRandomNationTile(gameManager.getEvilEmpire().id)
        );
        break;
      case "combat":
        debugger;
        const attackers = gameManager.getRandomCitizensOnTile(
          gameManager.getTileByCoordinates(
            currentGameEvent.target.currentPosition.x,
            currentGameEvent.target.currentPosition.y
          ),
          3
        );
        const defenders = [currentGameEvent.target];
        const combatLog = gameManager.doCombat(attackers, defenders, true);
        setLog(combatLog);
        break;
      default:
        break;
    }
  }, [gameManager]);
  return (
    <Modal>
      <div className="bg-white w-1/4 p-4">
        <p>{currentGameEvent.gameEventData.name}</p>
        <p>{currentGameEvent.gameEventData.description}</p>
        <div className="p-2">
          {currentGameEvent.gameEventData.eventType === "combat" &&
            log.map(logEntry => <p>{logEntry}</p>)}
        </div>
        <button onClick={() => next()}>Next</button>
      </div>
    </Modal>
  );
};

export default Incident;
