import React, { useState } from "react";
import {
  WorldMap,
  CommandBar,
  FormSquad,
  SelectedTile,
  Operation
} from "../SpecialUse/index";
import { Agents, Squads } from "../TileGroups/index";
import { Modal } from "../GeneralUse";
import { operationTypes } from "../../data/gameEvents/operation";

/**
 * This is the primary screen component for EoE. It's used
 * for the main interface, as well as encounters, menus, etc.
 * @param {} props
 */
const Main = ({ gameManager }) => {
  const [modal, setModal] = useState(null);

  return (
    <React.Fragment>
      {modal && (
        <Modal>
          {/* Operation Modal example */}
          {modal.modalType === "operation" ? (
            <Operation
              operation={operationTypes[modal.operationType]}
              setModalOpen={setModal}
              gameManager={gameManager}
            />
          ) : (
            <FormSquad gameManager={gameManager} setModalOpen={setModal} />
          )}
        </Modal>
      )}

      <header id="main-header">
        <span> Empire Of EVIL </span>
        <CommandBar gameManager={gameManager} />
        {gameManager.state.operations.length > 0 && (
          <div className="border">
            <p>Current Operations</p>
            {gameManager.state.operations.map(operation => (
              <div>
                <p>{operation.operationType.name}</p>
              </div>
            ))}
          </div>
        )}
      </header>

      <div id="game-area" className="flex flex-wrap">
        <WorldMap />
        {gameManager.state.gameReady && (
          <React.Fragment>
            <SelectedTile gameManager={gameManager} setModal={setModal} />
            <Agents gameManager={gameManager} />
            <Squads gameManager={gameManager} />
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

export default Main;
