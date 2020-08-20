import React, { useEffect, useContext } from "react";
import Modal from "../../Modal";
import { GameDataContext } from "../../../context/GameDataContext";

const AttackOperation = ({ operationData, next }) => {
  const gameDataContext = useContext(GameDataContext);
  useEffect(() => {
    const targetTile = gameDataContext.getTileById(operationData.targetTileId);
    gameDataContext.doTileCombat(
      targetTile,
      gameDataContext.getEvilEmpire().id
    );
    // ! probably gonna cause problems, it's not a regular dep
    // may need to make it one
  }, [gameDataContext]);
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
