import React, { Component } from "react";
import Collapsable from "./Collapsable";
import GameManager from "../containers/GameManager";
import connect from "unstated-connect";
class WorldMap extends Component {
  state = {
    tileSize: "32px",
    mapX: 10,
    mapY: 10,
    gameMap: [],
    mapLoaded: false
  };

  componentDidUpdate(prevProps, prevState) {
    const [GameManager] = this.props.containers;
    if (!this.state.mapLoaded && GameManager.state.gameMap.length > 0) {
      this.setState({ mapLoaded: true });
    }
  }

  render() {
    const [GameManager] = this.props.containers;
    if (GameManager.state.gameMap.length > 0 && GameManager.state.gameReady) {
      return (
        <Collapsable title="World Map">
          <div
            id="world-map"
            style={{
              gridTemplateColumns: `repeat(${GameManager.state.gameMap[0].length}, ${this.state.tileSize})`
            }}
          >
            {GameManager.state.gameMap.map(yRow => {
              return yRow.map(tile => {
                let tileClasses = [];
                if (tile.land) {
                  tileClasses.push("land-tile");
                } else {
                  tileClasses.push("water-tile");
                }
                if (
                  GameManager.getEvilEmpire() &&
                  tile.nationId === GameManager.getEvilEmpire().id
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
                      width: this.state.tileSize,
                      height: this.state.tileSize,
                      border: "1px solid black"
                    }}
                    onClick={() => {
                      console.log(tile.x, tile.y);
                      GameManager.selectTile(tile);
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

export default connect([GameManager])(WorldMap);
