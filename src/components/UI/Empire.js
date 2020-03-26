import React, { Component } from "react";
import Collapsable from "../Collapsable";

const Empire = props => {
  return (
    <React.Fragment>
      <div>
        <button
          className="border mr-1 px-1"
          onClick={() => props.gameManager.setScreen("empire-organization")}
        >
          Organization
        </button>
        <button
          className="border mr-1 px-1"
          onClick={() => props.gameManager.setScreen("empire-research")}
        >
          Research
        </button>
        <button
          className="border mr-1 px-1"
          onClick={() => props.gameManager.setScreen("empire-operations")}
        >
          Operations
        </button>
        <button
          className="border mr-1 px-1"
          onClick={() => props.gameManager.setScreen("main")}
        >
          Back
        </button>
      </div>
      <h1> Empire </h1>
      <Collapsable title="Vital">
        <p>EVIL: {props.gameManager.getEvilEmpire().nationalControl}</p>
        <p>Cash: {props.gameManager.getEvilEmpire().cash}</p>
      </Collapsable>
      <Collapsable title="Personnel">
        <p>
          Total Agents:{" "}
          {
            props.gameManager.getAgents(props.gameManager.getEvilEmpire().id)
              .length
          }
        </p>
      </Collapsable>
      <Collapsable title="Financials">
        <div id="empire-economics">
          <div id="empire-economics-income">
            <p>Income Sources</p>
          </div>
          <div id="empire-economics-expenses">
            <p>Expense Sources</p>
          </div>
          <div id="empire-economics-net-funding">
            <p>Net Income/Loss per Month</p>
          </div>
        </div>
      </Collapsable>
    </React.Fragment>
  );
};

export default Empire;
