import React, { Component } from "react";
import { makeMap } from "../../commonUtilities/map/map";

class WorldMap extends Component {
  state = {
    tileSize: "18px",
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
        <div
          id="world-map"
          style={{
            gridTemplateColumns: `repeat(${this.state.gameMap[0].length}, ${this.state.tileSize})`
          }}
        >
          {this.state.gameMap.map(yRow => {
            return yRow.map(tile => {
              let tileClasses = [];
              if (tile.land) tileClasses.push("land-tile");
              return (
                <div
                  className={tileClasses.join(" ")}
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
      );
    } else {
      return <div>No map</div>;
    }
  }
}

export default WorldMap;
