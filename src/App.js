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
    return (
      <div className="App">
        <h1> Empire Of Evil </h1>
        <CommandBar />
        <WorldMap />
        <Agents />
      </div>
    );
  }
}

export default connect([GameManager])(App);
