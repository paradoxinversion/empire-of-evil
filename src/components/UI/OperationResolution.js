import React, { useState, useContext } from "react";
// import MoveOperation from "./OperationResolution/MoveOperation";
// import AttackOperation from "./OperationResolution/AttackOperation";
// import TakeOverOperation from "./OperationResolution/TakeOverOperation";
import {
  MoveOperation,
  AttackOperation,
  TakeOverOperation,
} from "./OperationResolution/index";
import { GameDataContext } from "../../context/GameDataContext";
const resolutionTypes = {
  move: MoveOperation,
  attack: AttackOperation,
  takeover: TakeOverOperation,
};
const OperationResolution = () => {
  const gameDataContext = useContext(GameDataContext);
  const [currentOperationIndex, setCurrentOperationIndex] = useState(0);
  const operationData =
    gameDataContext.gameState.operations[currentOperationIndex];
  const ResolutionComponent =
    resolutionTypes[operationData.operationType.operationType];
  const next = () => {
    // if there's another operation, increment index
    if (
      currentOperationIndex <
      gameDataContext.gameState.operations.length - 1
    ) {
      setCurrentOperationIndex(currentOperationIndex + 1);
    } else {
      // if this is the last operation, go back to the main screen
      gameDataContext.setScreen("main");
      gameDataContext.clearOperations();
    }
  };
  return <ResolutionComponent operationData={operationData} next={next} />;
};

export default OperationResolution;
