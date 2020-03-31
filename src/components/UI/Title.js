import React from "react";
import store from "store";
const Title = ({ gameManager }) => {
  return (
    <div>
      <p>Empire of Evil</p>
      <p>A game of world domination</p>
      <button
        onClick={async () => {
          await gameManager.setUpGame();
          gameManager.setScreen("main");
        }}>
        New Game
      </button>
      {store.get("eoe-gamedata") && (
        <button
          onClick={async () => {
            await gameManager.loadGame();
            gameManager.setScreen("main");
          }}>
          Load Game
        </button>
      )}
    </div>
  );
};

export default Title;
