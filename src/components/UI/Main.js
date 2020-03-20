import React, { Component, useState } from "react";
import WorldMap from "../WorldMap";
import CommandBar from "../CommandBar";
import Agents from "../Agents";
import Modal from "../Modal";
import Operation from "../Operation";
import { operationTypes } from "../../data/operation";
const Main = props => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOperation, setModalOperation] = useState("");
  return (
    <React.Fragment>
      {modalOpen && (
        <Modal>
          {/* Operation Modal example */}
          <Operation
            operation={operationTypes[modalOperation]}
            setModalOpen={setModalOpen}
          />
        </Modal>
      )}
      <div className="mb-4">
        <span> Empire Of Evil </span>
        <div>
          <CommandBar gameManager={props.gameManager} />
        </div>

        <div id="selected-tile" className="border">
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
              <div className="border">
                <p>Tile Info</p>
                <p>
                  Citizens:{" "}
                  {props.gameManager.state.selectedTile.citizens.length}
                </p>
                <p>Agents: {}?</p>

                <div>
                  <button
                    onClick={() => {
                      setModalOpen(true);
                      setModalOperation("scout");
                    }}
                  >
                    Scout
                  </button>
                  <button>Attack</button>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
      <div id="game-area" className="flex">
        <WorldMap />
        <Agents />
      </div>
    </React.Fragment>
  );
};

export default Main;
