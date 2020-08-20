import React, { useContext } from "react";
import store from "store";
import { GameDataContext } from "../../context/GameDataContext";
const Title = () => {
  const gameDataContext = useContext(GameDataContext);
  return (
    <div>
      <p>Empire of Evil</p>
      <p>A game of world domination</p>
      <button
        className="btn"
        onClick={async () => {
          await gameDataContext.setUpGame();
          gameDataContext.setScreen("main");
        }}
      >
        New Game
      </button>
      {store.get("eoe-gamedata") && (
        <button
          onClick={async () => {
            await gameDataContext.loadGame();
            gameDataContext.setScreen("main");
          }}
        >
          Load Game
        </button>
      )}
    </div>
  );
};

export default Title;
