import React, { Component } from "react";
import connect from "unstated-connect";
import GameManager from "./containers/GameManager";
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

const UIScreens = {
  main: Main,
  empire: Empire,
  agents: AgentsUI,
  "empire-organization": EmpireOrganizationUI,
  "empire-operations": EmpireOperationsUI,
  "empire-research": EmpireResearchUI,
  "turn-resolution": TurnResolution,
  "profile-agent": AgentProfile,
  "profile-squad": SquadProfile
};

class App extends Component {
  componentDidMount() {
    const [GameManager] = this.props.containers;
    GameManager.setUpGame();
  }
  render() {
    const [GameManager] = this.props.containers;
    const CurrentScreen = UIScreens[GameManager.state.currentScreen];
    return (
      <main className="App">
        <CurrentScreen gameManager={GameManager} />
      </main>
    );
  }
}

export default connect([GameManager])(App);
