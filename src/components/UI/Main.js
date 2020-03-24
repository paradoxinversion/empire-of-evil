import React, { Component, useState } from "react";
import WorldMap from "../WorldMap";
import CommandBar from "../CommandBar";
import Agents from "../Agents";
import Modal from "../Modal";
import Operation from "../Operation";
import { operationTypes } from "../../data/operation";
import FormSquad from "../FormSquad";
import Squad from "../Squad";

// modal info will be something like
// {
//   modalType, // string, 'operation', 'form-squad'
// }

/**
 * This is the primary screen component for EoE. It's used
 * for the main interface, as well as encounters, menus, etc.
 * @param {} props
 */
const Main = props => {
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
              gameManager={props.gameManager}
            />
          ) : (
            <FormSquad
              gameManager={props.gameManager}
              setModalOpen={setModal}
            />
          )}
        </Modal>
      )}
      <div className="mb-4">
        <span> Empire Of Evil </span>
        <div>
          <CommandBar gameManager={props.gameManager} />
          <div>
            <p>Current Operations</p>
            {props.gameManager.getOperations().map(operation => (
              <div>
                <p>{operation.operationType.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="selected-tile" className="border">
          {props.gameManager.state.selectedTile && (
            <div>
              <p>
                Coordinates: {props.gameManager.state.selectedTile.tile.x},
                {props.gameManager.state.selectedTile.tile.y}
              </p>
              <p>
                Owner:{" "}
                {
                  props.gameManager.state.nations[
                    props.gameManager.state.selectedTile.tile.nationId
                  ].name
                }{" "}
              </p>
              <p>
                {props.gameManager.state.selectedTile.hasEvilNeighbor
                  ? "yes"
                  : "no"}
              </p>
              <div className="border">
                <p>Tile Info</p>
                <div>
                  <button
                    className="border rounded"
                    onClick={() => {
                      setModal({
                        modalType: "form-squad"
                      });
                    }}
                  >
                    Form Squad/Team Here
                  </button>
                  {Object.values(
                    props.gameManager.state.selectedTile.adjacentSquads
                  ).map(adjacentSquads => (
                    <div>
                      <p>Adjacent Squads</p>
                      {adjacentSquads.map(squad => (
                        <div>
                          <Squad squad={squad} />
                          <button
                            onClick={() => {
                              setModal({
                                modalType: "operation",
                                operationType: "move"
                              });
                            }}
                          >
                            Move Squad
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}

                  {props.gameManager.getSquadsOnTile(
                    props.gameManager.getEvilEmpire().id,
                    props.gameManager.state.selectedTile.tile
                  ).length > 0 && (
                    <div>
                      <button
                        onClick={() => {
                          setModal({
                            modalType: "operation",
                            operationType: "attack"
                          });
                        }}
                      >
                        Attack
                      </button>
                    </div>
                  )}
                </div>
                <p>
                  Citizens:{" "}
                  {props.gameManager.state.selectedTile.citizens.length}
                </p>
                <p>Agents: {}?</p>
                {/* 
                <div>
                  <button
                    onClick={() => {
                      setModal({
                        modalType: "operation",
                        operationType: "scout"
                      });
                    }}
                  >
                    Scout
                  </button>
                  <button>Attack</button>
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
      <div id="game-area" className="flex">
        <WorldMap />
        <Agents />
      </div>
    </React.Fragment>
  );
};

export default Main;
