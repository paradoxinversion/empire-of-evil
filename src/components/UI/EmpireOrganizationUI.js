import React, { useState, useContext } from "react";

import FormSquad from "../FormSquad";
import { GameDataContext } from "../../context/GameDataContext";
import { Agents, Squads } from "../TileGroups/index";

const EmpireOrganizationUI = () => {
  const gameDataContext = useContext(GameDataContext);
  const [organizationContext, setOrganizationContext] = useState("agents");

  const handleChange = function (event) {
    setOrganizationContext(event.target.value);
  };
  return (
    <div>
      <p>Empire Organization</p>
      <div>
        <button
          className="border mr-1"
          onClick={() => gameDataContext.setScreen("empire-research")}
        >
          Research
        </button>
        <button
          className="border mr-1"
          onClick={() => gameDataContext.setScreen("empire-operations")}
        >
          Operations
        </button>
        <button
          className="border mr-1"
          onClick={() => gameDataContext.setScreen("main")}
        >
          Back
        </button>
        <div>
          <div>
            <input
              type="radio"
              id="personnel-type-agents"
              name="personnel-type"
              value="agents"
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <label htmlFor="personnel-type-agents">Agents</label>
          </div>
          <div>
            <input
              type="radio"
              id="personnel-type-squads"
              name="personnel-type"
              value="squads"
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <label htmlFor="personnel-type-squads">Squads</label>
          </div>
        </div>
        {organizationContext === "agents" && (
          <div>
            <button>Transfer to Squad?</button>
            <Agents gameManager={gameManager} />
          </div>
        )}
        {organizationContext === "squads" && (
          <div>
            <Squads
              showSquadOptions={true}
              gameManager={gameManager}
              showDisband={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpireOrganizationUI;
