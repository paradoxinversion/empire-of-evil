import React from "react";
import Modal from "../../Modal";

const MoveOperation = ({ operation, next }) => {
  return (
    <Modal>
      <div>
        <p>Moving {operation.squads.length} squads</p>
        <button onClick={() => next()}>Next</button>
      </div>
    </Modal>
  );
};

export default MoveOperation;
