import React, { Component } from "react";

const Empire = props => {
  return (
    <React.Fragment>
      <div>
        <button
          className="border mr-1"
          onClick={() => props.gameManager.setScreen("empire-organization")}
        >
          Organization
        </button>
        <button
          className="border mr-1"
          onClick={() => props.gameManager.setScreen("empire-research")}
        >
          Research
        </button>
        <button
          className="border mr-1"
          onClick={() => props.gameManager.setScreen("empire-operations")}
        >
          Operations
        </button>
        <button
          className="border mr-1"
          onClick={() => props.gameManager.setScreen("main")}
        >
          Back
        </button>
      </div>
      <h1> Empire </h1>
      <p>EVIL: {props.gameManager.getEvilEmpire().nationalControl}</p>
      <p>Cash: {props.gameManager.getEvilEmpire().cash}</p>
      <p>
        Total Agents:{" "}
        {
          props.gameManager.getEvilAgents(
            props.gameManager.getCitizens(),
            props.gameManager.getEvilEmpire().id,
            null
          ).length
        }
      </p>
      <div className="border" id="empire-economics">
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
    </React.Fragment>
  );
};

export default Empire;
