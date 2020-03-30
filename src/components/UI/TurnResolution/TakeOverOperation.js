import React, { useEffect } from "react";
import { Modal } from "../../GeneralUse/index";

const TakeOverOperation = ({ gameManager, currentGameEvent, next }) => {
  useEffect(() => {
    const targetTile = gameManager.getTileById(currentGameEvent.targetTileId);
    gameManager.changeTileOwner(targetTile, gameManager.getEvilEmpire().id);
  }, [gameManager]);
  return (
    <Modal>
      <div className="bg-white w-1/4 p-4">
        <p>Takeover!</p>
        <button onClick={() => next()}>Next</button>
      </div>
    </Modal>
  );
};

export default TakeOverOperation;
