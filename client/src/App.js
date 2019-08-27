import React, { Component } from "react";
import { makeMap } from "../../commonUtilities/map/map";
import "./App.css";
import WorldMap from "./WorldMap";

class App extends Component {
  state = {};
  componentDidMount() {}
  render() {
    return (
      <div className="App">
        <h1> Empire Of Evil </h1>
        <WorldMap />
      </div>
    );
  }
}

export default App;
