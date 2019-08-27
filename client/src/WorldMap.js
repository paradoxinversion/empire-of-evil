import React, { Component } from "react";
import { makeMap } from "../../commonUtilities/map/map";
import Collapsable from "./Collapsable";

class WorldMap extends Component {
  state = {
    tileSize: "32px",
    mapX: 10,
    mapY: 10,
    gameMap: []
  };
  componentDidMount() {
    const gameMap = makeMap();
    this.setState({
      gameMap
    });
  }
  render() {
    if (this.state.gameMap.length > 0) {
      return (
        <Collapsable title="World Map">
          <div
            id="world-map"
            style={{
              gridTemplateColumns: `repeat(${this.state.gameMap[0].length}, ${
                this.state.tileSize
              })`
            }}>
            {this.state.gameMap.map(yRow => {
              return yRow.map(tile => {
                let tileClasses = [];
                if (tile.land) {
                  tileClasses.push("land-tile");
                } else {
                  tileClasses.push("water-tile");
                }
                return (
                  <div
                    key={`${tile.x}-${tile.y}`}
                    className={tileClasses.join(" ")}
                    data-tile-x={tile.x}
                    data-tile-y={tile.y}
                    style={{
                      width: this.state.tileSize,
                      height: this.state.tileSize,
                      border: "1px solid black"
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
  }
}

export default WorldMap;
