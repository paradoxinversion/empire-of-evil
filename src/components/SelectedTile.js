import React, { useContext } from "react";
import Collapsable from "./Collapsable";
import Squad from "./Squad";
import { GameDataContext } from "../context/GameDataContext";

const SelectedTile = ({ setModal }) => {
  const gameDataContext = useContext(GameDataContext);
  return (
    <Collapsable title="Selected Tile" width="1/2">
      {gameDataContext.gameState.selectedTile ? (
        <div className="p-1">
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
              Citizens: {gameDataContext.gameState.selectedTile.citizens.length}
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
            ).map((adjacentSquads) => (
              <Collapsable title="Adjacent Squads">
                {adjacentSquads.map((squad) => (
                  <Collapsable title={squad.name}>
                    <Squad squad={squad} />
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
            <Collapsable title="Tile Squads">
              {gameDataContext
                .getSquadsOnTile(
                  gameDataContext.getEvilEmpire().id,
                  gameDataContext.gameState.selectedTile.tile
                )
                .map((squad) => (
                  <Collapsable title={squad.name}>
                    <Squad squad={squad} />
                    <div id={`${squad.name}-actions`} className="px-1">
                      {Object.keys(
                        gameDataContext.getOccupiedSquads()
                      ).includes(squad.id) === false && (
                        <button onClick={() => {}}>Action</button>
                      )}
                    </div>
                  </Collapsable>
                ))}
            </Collapsable>

            {gameDataContext.getSquadsOnTile(
              gameDataContext.getEvilEmpire().id,
              gameDataContext.gameState.selectedTile.tile
            ).length > 0 && (
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
      ) : (
        <div className="p-1">
          <p>Select a Tile</p>
        </div>
      )}
    </Collapsable>
  );
};

export default SelectedTile;
