import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import { GameDataProvider } from "./context/GameDataContext.js";
ReactDOM.render(
  <GameDataProvider>
    <App />
  </GameDataProvider>,
  document.getElementById("root")
);
