import type { GameState } from "@empire-of-evil/engine";
import { useGameStore } from "../store/gameStore.js";

export const useGameState = (): GameState => {
    // Subscribe to both version and gameState to ensure updates trigger re-renders.
    // We use a single selector that returns an object with both values to ensure
    // the subscription properly monitors the version counter while accessing gameState.
    const { version: _, gameState } = useGameStore((s) => ({
        version: s.version,
        gameState: s.gameState,
    }));
    if (!gameState)
        throw new Error(
            "No game state — render this hook only when a game is loaded",
        );
    return gameState;
};
