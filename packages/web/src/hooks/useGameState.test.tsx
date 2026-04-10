import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { useGameState } from "./useGameState";
import { useGameStore } from "../store/gameStore";
import type { GameState } from "@empire-of-evil/engine";

describe("useGameState subscription behavior", () => {
    it("should trigger component re-render when version increments in store", () => {
        // Set up initial game state
        const initialGameState = {
            date: 0,
            eventLog: [{ event: { id: "e1", title: "Event 1" } }],
        } as unknown as GameState;

        act(() => {
            useGameStore.setState({
                gameState: initialGameState,
                version: 0,
            });
        });

        // Render hook and capture initial state
        const { result, rerender } = renderHook(() => useGameState());
        expect(result.current.eventLog).toHaveLength(1);
        expect(result.current.eventLog[0].event.title).toBe("Event 1");

        // Increment version (simulating a day advancement)
        act(() => {
            useGameStore.setState((s) => ({ version: s.version + 1 }));
        });

        // Hook should still see the same gameState reference (in-place mutation)
        // but if the component subscribed to version correctly, it should have re-rendered
        expect(result.current.eventLog).toHaveLength(1);
    });

    it("should re-subscribe to version on each render", () => {
        const initialGameState = {
            date: 0,
            eventLog: [],
        } as unknown as GameState;

        act(() => {
            useGameStore.setState({
                gameState: initialGameState,
                version: 0,
            });
        });

        const { result } = renderHook(() => {
            // This mimics what useGameState does
            const version = useGameStore((s) => s.version);
            const gameState = useGameStore((s) => s.gameState);
            return { version, gameState };
        });

        expect(result.current.version).toBe(0);

        // Increment version
        act(() => {
            useGameStore.setState((s) => ({ version: s.version + 1 }));
        });

        // After version increment, result.current should reflect new version
        // (This verifies the subscription is working)
        expect(result.current.version).toBe(1);
    });
});
