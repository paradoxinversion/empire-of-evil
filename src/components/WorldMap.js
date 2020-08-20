import React, { Component, useContext, useState } from "react";
import Collapsable from "./Collapsable";
import { GameDataContext } from "../context/GameDataContext";

const tileSize = "32px";
const WorldMap = () => {
  const gameDataContext = useContext(GameDataContext);
  const [mapState, setMapState] = useState({
    mapX: 10,
    mapY: 10,
    gameMap: [],
    mapLoaded: false,
  });

  if (
    gameDataContext.gameState.gameMap.length > 0 &&
    gameDataContext.gameState.gameReady
  ) {
    return (
      <Collapsable title="World Map">
        <div
          id="world-map"
          style={{
            gridTemplateColumns: `repeat(${gameDataContext.gameState.gameMap[0].length}, ${tileSize})`,
          }}
        >
          {gameDataContext.gameState.gameMap.map((yRow) => {
            return yRow.map((tile) => {
              let tileClasses = [];
              if (tile.land) {
                tileClasses.push("land-tile");
              } else {
                tileClasses.push("water-tile");
              }
              if (
                gameDataContext.getEvilEmpire() &&
                tile.nationId === gameDataContext.getEvilEmpire().id
              ) {
                tileClasses.push("evil-empire-tile");
              }
              return (
                <div
                  key={`${tile.x}-${tile.y}`}
                  className={tileClasses.join(" ")}
                  data-tile-x={tile.x}
                  data-tile-y={tile.y}
                  style={{
                    width: tileSize,
                    height: tileSize,
                    border: "1px solid black",
                  }}
                  onClick={() => {
                    gameDataContext.selectTile(tile);
                  }}
                />
              );
            });
          })}
        </div>
      </Collapsable>
    );
  } else {
    return <div>No map</div>;
  }
};
export default WorldMap;
