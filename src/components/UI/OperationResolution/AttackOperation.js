import React, { useEffect } from "react";
import Modal from "../../Modal";

const AttackOperation = ({ gameManager, operationData, next }) => {
  useEffect(() => {
    const targetTile = gameManager.getTileById(operationData.targetTileId);
    gameManager.doTileCombat(targetTile, gameManager.getEvilEmpire().id);
  }, [gameManager]);
  return (
    <Modal>
      <div className="bg-white w-1/4 p-4">
        <p>COMBAT!</p>
        <button onClick={() => next()}>Next</button>
      </div>
    </Modal>
  );
};

export default AttackOperation;
