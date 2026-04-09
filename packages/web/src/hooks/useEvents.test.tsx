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

    it("uses informationTier to set feed type for intercepted and intel events", () => {
        vi.mocked(useGameState).mockReturnValue({
            date: 10,
            pendingEvents: [],
            eventLog: [
                {
                    event: {
                        id: "news-1",
                        category: "informational",
                        informationTier: "news_feed",
                        title: "News",
                        body: "Something happened.",
                        relatedEntityIds: [],
                        requiresResolution: false,
                        createdOnDate: 7,
                    },
                    resolvedOnDate: 7,
                },
                {
                    event: {
                        id: "intel-1",
                        category: "informational",
                        informationTier: "intelligence_report",
                        title: "Intel Report",
                        body: "We found something.",
                        relatedEntityIds: [],
                        requiresResolution: false,
                        createdOnDate: 8,
                    },
                    resolvedOnDate: 8,
                },
                {
                    event: {
                        id: "intercept-1",
                        category: "informational",
                        informationTier: "intercepted_communication",
                        title: "Intercepted Comm",
                        body: "They said something.",
                        relatedEntityIds: [],
                        requiresResolution: false,
                        createdOnDate: 9,
                    },
                    resolvedOnDate: 9,
                },
            ],
        } as any);

        const { result } = renderHook(() => useEvents());
        const entries = result.current.feedEntries;

        // feedEntries is reversed, so newest first
        expect(entries[0].id).toBe("intercept-1");
        expect(entries[0].type).toBe("intercept");

        expect(entries[1].id).toBe("intel-1");
        expect(entries[1].type).toBe("intel");

        expect(entries[2].id).toBe("news-1");
        expect(entries[2].type).toBe("news");
    });
});
