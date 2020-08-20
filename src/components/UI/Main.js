import React, { Component, useState, useCallback, useContext } from "react";
import { GameDataContext } from "../../context/GameDataContext";
import {
  WorldMap,
  CommandBar,
  FormSquad,
  SelectedTile,
  Operation,
} from "../SpecialUse/index";
import { Agents, Squads } from "../TileGroups/index";
import { Modal } from "../GeneralUse";
import { operationTypes } from "../../data/gameEvents/operation";

/**
 * This is the primary screen component for EoE. It's used
 * for the main interface, as well as encounters, menus, etc.
 * @param {} props
 */
const Main = () => {
  const [modal, setModal] = useState(null);
  const gameDataContext = useContext(GameDataContext);
  return (
    <React.Fragment>
      {modal && (
        <Modal>
          {/* Operation Modal example */}
          {modal.modalType === "operation" ? (
            <Operation
              operation={operationTypes[modal.operationType]}
              setModalOpen={setModal}
            />
          ) : (
            <FormSquad setModalOpen={setModal} />
          )}
        </Modal>
      )}

      <header id="main-header">
        <span> Empire Of EVIL </span>
        <CommandBar />
        {gameDataContext.gameState.operations.length > 0 && (
          <div className="border">
            <p>Current Operations</p>
            {gameDataContext.gameState.operations.map((operation) => (
              <div>
                <p>{operation.gameEventData.name}</p>
              </div>
            ))}
          </div>
        )}
      </header>

      <div id="game-area" className="flex flex-wrap">
        <WorldMap />
        {gameDataContext.gameState.gameReady && (
          <React.Fragment>
            <SelectedTile setModal={setModal} />
            <Agents />
            <Squads />
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

export default Main;
