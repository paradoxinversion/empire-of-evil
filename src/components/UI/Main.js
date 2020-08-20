import React, { Component, useState, useCallback, useContext } from "react";
import WorldMap from "../WorldMap";
import CommandBar from "../CommandBar";
import Agents from "../Agents";
import Modal from "../Modal";
import Operation from "../Operation";
import { operationTypes } from "../../data/operation";
import FormSquad from "../FormSquad";
import SelectedTile from "../SelectedTile";
import Squads from "../Squads";
import { GameDataContext } from "../../context/GameDataContext";

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
                <p>{operation.operationType.name}</p>
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
