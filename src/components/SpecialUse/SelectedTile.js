import React from "react";
import { Collapsable } from "../GeneralUse/index";
import { Squad, Agent } from "../Tiles/index";
import PropTypes from "prop-types";
const SelectedTile = ({ gameManager, setModal }) => {
  return (
    // <Collapsable title="Selected Tile" width="1/4">
    <div className="flex flex-grow px-4">
      {gameManager.state.selectedTile ? (
        <React.Fragment>
          <div className="w-2/5">
            <h2>
              <strong>Selected Tile</strong>
            </h2>
            <p>
              Coordinates: {gameManager.state.selectedTile.tile.x},
              {gameManager.state.selectedTile.tile.y}
            </p>
            <p>
              Nation:{" "}
              {
                gameManager.state.nations[
                  gameManager.state.selectedTile.tile.nationId
                ].name
              }{" "}
            </p>
            <div id="tile-recon">
              <strong>Reconnaissance</strong>
              <p>Citizens: {gameManager.state.selectedTile.citizens.length}</p>
            </div>
            <div id="tile-actions">
              <p>
                <strong>Actions</strong>
              </p>
              {gameManager.state.selectedTile.tile.nationId ===
                gameManager.getEvilEmpire().id &&
                gameManager.getSquadlessAgentsOnTile(
                  gameManager.getEvilEmpire().id,

                  gameManager.state.selectedTile
                ) && (
                  <button
                    className="border rounded"
                    onClick={() => {
                      setModal({
                        modalType: "form-squad"
                      });
                    }}>
                    Form Squad/Team Here
                  </button>
                )}

              {Object.values(gameManager.state.selectedTile.adjacentSquads).map(
                adjacentSquads => (
                  <Collapsable title="Adjacent Squads">
                    {adjacentSquads.map(squad => (
                      <Collapsable title={squad.name}>
                        <Squad squad={squad} gameManager={gameManager} />
                        <div id={`${squad.name}-actions`} className="px-1">
                          {Object.keys(
                            gameManager.getOccupiedSquads()
                          ).includes(squad.id) === false && (
                            <button
                              onClick={() => {
                                setModal({
                                  modalType: "operation",
                                  operationType: "move"
                                });
                              }}>
                              Move Squad
                            </button>
                          )}
                        </div>
                      </Collapsable>
                    ))}
                  </Collapsable>
                )
              )}

              {gameManager.getCPUAgentsOnTile(
                gameManager.state.selectedTile.tile
              ).length > 0 &&
                gameManager.getSquadsOnTile(
                  gameManager.getEvilEmpire().id,
                  gameManager.state.selectedTile.tile
                ).length > 0 && (
                  <div>
                    <button
                      className="border"
                      onClick={() => {
                        setModal({
                          modalType: "operation",
                          operationType: "takeover"
                        });
                      }}>
                      take over
                    </button>
                  </div>
                )}
            </div>
          </div>

          <div id="tile-agents-squads" className="w-3/5">
            <Collapsable title="EVIL Agents Here">
              {gameManager
                .getAgentsOnTile(
                  gameManager.getEvilEmpire().id,
                  gameManager.getSelectedTile()
                )
                .map(agent => (
                  <Agent agent={agent} gameManager={gameManager} />
                ))}
            </Collapsable>
            <Collapsable title="Tile Squads">
              {gameManager
                .getSquadsOnTile(
                  gameManager.getEvilEmpire().id,
                  gameManager.state.selectedTile.tile
                )
                .map(squad => (
                  <Collapsable
                    key={`st-collapsable-squad-${squad.id}`}
                    title={squad.name}>
                    <Squad squad={squad} gameManager={gameManager} />
                    <div id={`${squad.name}-actions`} className="px-1">
                      {!Object.keys(gameManager.getOccupiedSquads()).includes(
                        squad.id
                      ) && (
                        <div>
                          {gameManager.getSelectedTile().tile.nationId !==
                            gameManager.getEvilEmpire().id && (
                            <div>
                              <button
                                onClick={() => {
                                  setModal({
                                    modalType: "operation",
                                    operationType: "attack"
                                  });
                                }}>
                                Attack
                              </button>
                            </div>
                          )}
                          <button onClick={() => {}}>Action</button>
                        </div>
                      )}
                    </div>
                  </Collapsable>
                ))}
            </Collapsable>
          </div>
        </React.Fragment>
      ) : (
        <div className="p-1">
          <p>Select a Tile</p>
        </div>
      )}
    </div>
    // </Collapsable>
  );
};

SelectedTile.propTypes = {
  gameManager: PropTypes.object.isRequired,
  setModal: PropTypes.func
};

export default SelectedTile;
