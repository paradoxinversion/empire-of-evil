import React, { useState } from "react";
import MoveOperation from "./OperationResolution/MoveOperation";

const resolutionTypes = {
  move: MoveOperation
};
const OperationResolution = ({ gameManager }) => {
  const [currentOperationIndex, setCurrentOperationIndex] = useState(0);
  const operationData = gameManager.state.operations[currentOperationIndex];
  const ResolutionComponent =
    resolutionTypes[operationData.operationType.operationType];
  const next = () => {
    // if there's another operation, increment index
    if (currentOperationIndex < gameManager.state.operations.length - 1) {
      setCurrentOperationIndex(currentOperationIndex + 1);
    } else {
      // if this is the last operation, go back to the main screen
      gameManager.setScreen("main");
      gameManager.clearOperations();
    }
  };
  return (
    <ResolutionComponent
      gameManager={gameManager}
      operationData={operationData}
      next={next}
    />
  );
};

export default OperationResolution;
