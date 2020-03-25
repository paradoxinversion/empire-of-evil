import React, { useEffect } from "react";
import Modal from "../../Modal";

const TakeOverOperation = ({ gameManager, operationData, next }) => {
  useEffect(() => {
    const targetTile = gameManager.getTileById(operationData.targetTileId);
    gameManager.changeTileOwner(targetTile, gameManager.getEvilEmpire().id);
  }, [gameManager]);
  return (
    <Modal>
      <div>
        <p>Takeover!</p>
        <button onClick={() => next()}>Next</button>
      </div>
    </Modal>
  );
};

export default TakeOverOperation;
