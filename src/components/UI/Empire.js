import React, { Component, useContext } from "react";
import { GameDataContext } from "../../context/GameDataContext";
import { Collapsable } from "../GeneralUse/index";

const Empire = (props) => {
  const gameDataContext = useContext(GameDataContext);
  return (
    <React.Fragment>
      <div>
        <button
          className="border mr-1 px-1"
          onClick={() => gameDataContext.setScreen("empire-organization")}
        >
          Organization
        </button>
        <button
          className="border mr-1 px-1"
          onClick={() => gameDataContext.setScreen("empire-research")}
        >
          Research
        </button>
        <button
          className="border mr-1 px-1"
          onClick={() => gameDataContext.setScreen("empire-operations")}
        >
          Operations
        </button>
        <button
          className="border mr-1 px-1"
          onClick={() => gameDataContext.setScreen("main")}
        >
          Back
        </button>
      </div>
      <h1> Empire </h1>
      <Collapsable title="Vital">
        <p>EVIL: {gameDataContext.getEvilEmpire().nationalControl}</p>
        <p>Cash: {gameDataContext.getEvilEmpire().cash}</p>
      </Collapsable>
      <Collapsable title="Personnel">
        <p>
          Total Agents:{" "}
          {gameDataContext.getAgents(gameDataContext.getEvilEmpire().id).length}
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
