import React, { Component } from "react";
import WorldMap from "../WorldMap";
import CommandBar from "../CommandBar";
import Agents from "../Agents";

const Main = props => {
  return (
    <React.Fragment>
      <h1> Empire Of Evil </h1>
      <CommandBar gameManager={props.gameManager} />
      <div id="game-area">
        <div id="selected-tile">
          {props.gameManager.state.selectedTile && (
            <React.Fragment>
              <p>
                Coordinates: {props.gameManager.state.selectedTile.tile.x},
                {props.gameManager.state.selectedTile.tile.y}
              </p>
              <p>
                Owner:{" "}
                {
                  props.gameManager.state.nations[
                    props.gameManager.state.selectedTile.tile.nationId
                  ].name
                }{" "}
              </p>
              <p>
                {props.gameManager.state.selectedTile.hasEvilNeighbor
                  ? "yes"
                  : "no"}
              </p>
            </React.Fragment>
          )}
        </div>
        <WorldMap />
        <Agents />
      </div>
    </React.Fragment>
  );
};

export default Main;
