import React, { useEffect } from "react";
import { Modal } from "../../GeneralUse/index";

const AttackOperation = ({ gameManager, currentGameEvent, next }) => {
  useEffect(() => {
    const targetTile = gameManager.getTileById(currentGameEvent.targetTileId);
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
