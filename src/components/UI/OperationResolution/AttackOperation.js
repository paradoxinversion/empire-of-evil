import React, { useEffect } from "react";
import Modal from "../../Modal";

const AttackOperation = ({ gameManager, operationData, next }) => {
  useEffect(() => {
    const targetTile = gameManager.getTileById(operationData.targetTileId);
    gameManager.doTileCombat(targetTile, gameManager.getEvilEmpire().id);
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

export default AttackOperation;
