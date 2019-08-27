import React, { Component } from "react";
import { makeMap } from "../../commonUtilities/map/map";
import "./App.css";
import WorldMap from "./WorldMap";
import CommandBar from "./CommandBar";
import Agents from "./Agents";

class App extends Component {
  state = {};
  componentDidMount() {}
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

export default App;
