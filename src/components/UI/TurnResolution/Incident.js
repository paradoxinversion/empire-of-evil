import React, { useEffect } from "react";
import { Modal } from "../../GeneralUse/index";
const Incident = ({ gameManager, currentGameEvent, next }) => {
  useEffect(() => {
    // damage the participant
  });
  debugger;
  return (
    <Modal>
      <div className="bg-white w-1/4 p-4">
        <p>{currentGameEvent.gameEventData.name}</p>
        <p>{currentGameEvent.gameEventData.description}</p>
        <button onClick={() => next()}>Next</button>
      </div>
    </Modal>
  );
};

export default Incident;
