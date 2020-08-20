import React, { Component, useContext, useEffect, useState } from "react";
import Main from "./components/UI/Main";
import Empire from "./components/UI/Empire";
import AgentsUI from "./components/UI/AgentsUI";
import EmpireOrganizationUI from "./components/UI/EmpireOrganizationUI";
import EmpireOperationsUI from "./components/UI/EmpireOperationsUI";
import EmpireResearchUI from "./components/UI/EmpireResearchUI";
import TurnResolution from "./components/UI/TurnResolution/TurnResolution";
import { AgentProfile, SquadProfile } from "./components/Profile/index";
import "./App.css";
import "./output.css";
import { GameDataContext } from "./context/GameDataContext";
// import "./output.css";
import Title from "./components/UI/Title";

const UIScreens = {
  title: Title,
  main: Main,
  empire: Empire,
  agents: AgentsUI,
  "empire-organization": EmpireOrganizationUI,
  "empire-operations": EmpireOperationsUI,
  "empire-research": EmpireResearchUI,
  "operation-resolution": OperationResolution,
  "turn-resolution": TurnResolution,
  "profile-agent": AgentProfile,
  "profile-squad": SquadProfile,
};

const App = () => {
  const gameDataContext = useContext(GameDataContext);
  const [gamePrepared, setGamePrepared] = useState(false);
  useEffect(() => {
    gameDataContext.setUpGame().then(() => setGamePrepared(true));
  }, []);

  const CurrentScreen = UIScreens[gameDataContext.gameState.currentScreen];
  return (
    <React.Fragment>
      {gamePrepared ? (
        <main className="App">
          <CurrentScreen />
        </main>
      ) : (
        <p>loading</p>
      )}
    </React.Fragment>
  );
};
export default App;
