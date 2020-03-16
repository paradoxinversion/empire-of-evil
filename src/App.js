import React, { Component } from "react";
import "./App.css";
import WorldMap from "./components/WorldMap";
import CommandBar from "./components/CommandBar";
import Agents from "./components/Agents";
import connect from "unstated-connect";
import GameManager from "./containers/GameManager";
class App extends Component {
  state = {
    // nations: []
  };
  componentDidMount() {
    const [GameManager] = this.props.containers;
    GameManager.setUpGame();
  }
  render() {
    const [GameManager] = this.props.containers;
    return (
      <div className="App">
        <h1> Empire Of Evil </h1>
        <CommandBar />
        <div id="game-area">
          <div id="selected-tile">
            {GameManager.state.selectedTile && (
              <React.Fragment>
                <p>
                  Coordinates: {GameManager.state.selectedTile.tile.x},
                  {GameManager.state.selectedTile.tile.y}
                </p>
                <p>
                  Owner:{" "}
                  {
                    GameManager.state.nations[
                      GameManager.state.selectedTile.tile.nationId
                    ].name
                  }{" "}
                </p>
              </React.Fragment>
            )}
          </div>
          <WorldMap />
          <Agents />
        </div>
      </div>
    );
  }
}

export default connect([GameManager])(App);
