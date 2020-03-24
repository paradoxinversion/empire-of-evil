import React, { useEffect } from "react";
import Modal from "../../Modal";

const MoveOperation = ({ gameManager, operationData, next }) => {
  useEffect(() => {
    console.log(operationData);
    const targetTile = gameManager.getTileById(operationData.targetTileId);
    operationData.squads.forEach(squad => {
      gameManager.setSquadLocation(targetTile.x, targetTile.y, squad.id);
    });
  }, [gameManager]);
  return (
    <Modal>
      <div>
        <p>Moving {operationData.squads.length} squads</p>
        <button onClick={() => next()}>Next</button>
      </div>
    </Modal>
  );
};

export default MoveOperation;
