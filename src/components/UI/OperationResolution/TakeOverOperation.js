import React, { useEffect, useContext } from "react";
import Modal from "../../Modal";
import { GameDataContext } from "../../../context/GameDataContext";

const TakeOverOperation = ({ operationData, next }) => {
  const gameDataContext = useContext(GameDataContext);
  useEffect(() => {
    const targetTile = gameDataContext.getTileById(operationData.targetTileId);
    gameDataContext.changeTileOwner(
      targetTile,
      gameDataContext.getEvilEmpire().id
    );
  }, [gameDataContext]);
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
