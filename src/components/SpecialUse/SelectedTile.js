import React, { useContext } from "react";
import { Collapsable } from "../GeneralUse/index";
import { Squad, Agent } from "../Tiles/index";
import PropTypes from "prop-types";
import { GameDataContext } from "../../context/GameDataContext";
const SelectedTile = ({ setModal }) => {
  const gameDataContext = useContext(GameDataContext);
  return (
    <div className="flex flex-grow px-4">
      {gameDataContext.gameState.selectedTile ? (
        <React.Fragment>
          <div className="w-2/5">
            <h2>
              <strong>Selected Tile</strong>
            </h2>
            <p>
              Coordinates: {gameDataContext.gameState.selectedTile.tile.x},
              {gameDataContext.gameState.selectedTile.tile.y}
            </p>
            <p>
              Nation:{" "}
              {
                gameDataContext.gameState.nations[
                  gameDataContext.gameState.selectedTile.tile.nationId
                ].name
              }{" "}
            </p>
            <div id="tile-recon">
              <strong>Reconnaissance</strong>
              <p>
                Citizens:{" "}
                {gameDataContext.gameState.selectedTile.citizens.length}
              </p>
            </div>
            <div id="tile-actions">
              <p>
                <strong>Actions</strong>
              </p>
              {gameDataContext.gameState.selectedTile.tile.nationId ===
                gameDataContext.getEvilEmpire().id &&
                gameDataContext.getSquadlessAgentsOnTile(
                  gameDataContext.getEvilEmpire().id,

                  gameDataContext.gameState.selectedTile
                ) && (
                  <button
                    className="border rounded"
                    onClick={() => {
                      setModal({
                        modalType: "form-squad",
                      });
                    }}
                  >
                    Form Squad/Team Here
                  </button>
                )}

              {Object.values(
                gameDataContext.gameState.selectedTile.adjacentSquads
              ).map((adjacentSquads, index) => (
                <Collapsable
                  key={`adjacent-squads-${index}`}
                  title="Adjacent Squads"
                >
                  {adjacentSquads.map((squad) => (
                    <Collapsable
                      key={`adjacent-squads-${index}-${squad.id}`}
                      title={squad.name}
                    >
                      <Squad squad={squad} gameDataContext={gameDataContext} />
                      <div id={`${squad.name}-actions`} className="px-1">
                        {Object.keys(
                          gameDataContext.getOccupiedSquads()
                        ).includes(squad.id) === false && (
                          <button
                            onClick={() => {
                              setModal({
                                modalType: "operation",
                                operationType: "move",
                              });
                            }}
                          >
                            Move Squad
                          </button>
                        )}
                      </div>
                    </Collapsable>
                  ))}
                </Collapsable>
              ))}

              {gameDataContext.getCPUAgentsOnTile(
                gameDataContext.gameState.selectedTile.tile
              ).length > 0 &&
                gameDataContext.getSquadsOnTile(
                  gameDataContext.getEvilEmpire().id,
                  gameDataContext.gameState.selectedTile.tile
                ).length > 0 && (
                  <div>
                    <button
                      className="border"
                      onClick={() => {
                        setModal({
                          modalType: "operation",
                          operationType: "takeover",
                        });
                      }}
                    >
                      take over
                    </button>
                  </div>
                )}
            </div>
          </div>

          <div id="tile-agents-squads" className="w-3/5">
            <Collapsable title="EVIL Agents Here">
              {gameDataContext
                .getAgentsOnTile(
                  gameDataContext.getEvilEmpire().id,
                  gameDataContext.getSelectedTile()
                )
                .map((agent) => (
                  <Agent
                    key={`evil-agents-tile-${agent.id}`}
                    agent={agent}
                    gameDataContext={gameDataContext}
                  />
                ))}
            </Collapsable>
            <Collapsable title="Tile Squads">
              {gameDataContext
                .getSquadsOnTile(
                  gameDataContext.getEvilEmpire().id,
                  gameDataContext.gameState.selectedTile.tile
                )
                .map((squad) => (
                  <Collapsable
                    key={`st-collapsable-squad-${squad.id}`}
                    title={squad.name}
                  >
                    <Squad squad={squad} gameDataContext={gameDataContext} />
                    <div id={`${squad.name}-actions`} className="px-1">
                      {!Object.keys(
                        gameDataContext.getOccupiedSquads()
                      ).includes(squad.id) && (
                        <div>
                          {gameDataContext.getSelectedTile().tile.nationId !==
                            gameDataContext.getEvilEmpire().id && (
                            <div>
                              <button
                                onClick={() => {
                                  setModal({
                                    modalType: "operation",
                                    operationType: "attack",
                                  });
                                }}
                              >
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
  );
};

SelectedTile.propTypes = {
  setModal: PropTypes.func,
};

export default SelectedTile;
