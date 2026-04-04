import { useGameStore } from './store/gameStore.js';

export const App = () => {
  const status = useGameStore(s => s.status);
  const newGame = useGameStore(s => s.newGame);

  if (status === 'idle') {
    return (
      <div>
        <h1>Empire of EVIL</h1>
        <button
          onClick={() =>
            newGame({
              nationCount: 5,
              zonesPerNation: 4,
              populationDensity: 10,
              mapWidth: 20,
              mapHeight: 20,
            })
          }
        >
          New Game
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Empire of EVIL</h1>
      <p>Status: {status}</p>
    </div>
  );
};
