import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

import { useEvents } from "./useEvents";
import { useGameState } from "./useGameState";

vi.mock("./useGameState");

describe("useEvents", () => {
    it("maps gameState pending events and event log into events screen models", () => {
        vi.mocked(useGameState).mockReturnValue({
            date: 12,
            pendingEvents: [
                {
                    id: "pending-1",
                    category: "player_choice",
                    title: "Citizen Recruited",
                    body: "A citizen has been flagged",
                    relatedEntityIds: [],
                    requiresResolution: true,
                    createdOnDate: 12,
                },
            ],
            eventLog: [
                {
                    event: {
                        id: "log-1",
                        category: "informational",
                        title: "Uneventful Day",
                        body: "Nothing happened",
                        relatedEntityIds: [],
                        requiresResolution: false,
                        createdOnDate: 11,
                    },
                    resolvedOnDate: 11,
                },
            ],
        } as any);

        const { result } = renderHook(() => useEvents());

        expect(result.current.pendingEvents).toHaveLength(1);
        expect(result.current.pendingEvents[0].id).toBe("pending-1");

        expect(result.current.feedEntries).toHaveLength(1);
        expect(result.current.feedEntries[0].id).toBe("log-1");
        expect(result.current.feedEntries[0].title).toBe("Uneventful Day");
    });
});
