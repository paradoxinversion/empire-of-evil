import React, { Component } from "react";
import "./App.css";
import "./output.css";
import connect from "unstated-connect";
import GameManager from "./containers/GameManager";
import Main from "./components/UI/Main";
import Empire from "./components/UI/Empire";
import AgentsUI from "./components/UI/AgentsUI";

const UIScreens = {
  main: Main,
  empire: Empire,
  agents: AgentsUI
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
      <div className="App">
        <CurrentScreen gameManager={GameManager} />
      </div>
    );
  }
}

export default connect([GameManager])(App);
