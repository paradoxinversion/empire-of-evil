import React from "react";
import MoveOperation from "./OperationResolution/MoveOperation";

const resolutiontypes = {
  move: MoveOperation
};
const OperationResolution = ({ gameManager, operationData }) => {
  const ResolutionComponent = resolutiontypes[operationData.operationType];
  return (
    <ResolutionComponent
      gameManager={gameManager}
      operationData={operationData}
    />
  );
};

export default OperationResolution;
