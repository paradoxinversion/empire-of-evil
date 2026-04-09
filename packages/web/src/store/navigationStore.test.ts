import { beforeEach, describe, expect, test } from "vitest";

import { useNavigationStore } from "./navigationStore";
import { useGameStore } from "./gameStore";

describe("navigationStore", () => {
    beforeEach(() => {
        useNavigationStore.setState({ activeScreen: "empire" });
        useGameStore.setState({ status: "ready" } as any);
    });

    test("prevents screen changes while simulation is interrupted", () => {
        useGameStore.setState({ status: "interrupted" } as any);

        useNavigationStore.getState().setActiveScreen("events");

        expect(useNavigationStore.getState().activeScreen).toBe("empire");
    });

    test("allows screen changes when not interrupted", () => {
        useGameStore.setState({ status: "ready" } as any);

        useNavigationStore.getState().setActiveScreen("events");

        expect(useNavigationStore.getState().activeScreen).toBe("events");
    });
});
