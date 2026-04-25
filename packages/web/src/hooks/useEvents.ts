import { useMemo, useState } from "react";
import type { GameEvent } from "@empire-of-evil/engine";
import { useGameState } from "./useGameState";

export type FeedEntryType =
    | "intel"
    | "intercept"
    | "internal"
    | "news"
    | "combat"
    | "landmark"
    | "research";

export type EventSummary = {
    id: string;
    day: number;
    date: string;
    type: FeedEntryType;
    title: string;
    text: string;
    unread?: boolean;
    isAAR?: boolean;
};

export type AAREntry = {
    id: string;
    subject: string;
    date: string;
    status: "SUCCESS" | "PARTIAL" | "FAILURE" | "CRITICAL_FAILURE";
    executiveSummary: string;
    operationalLog: string[];
    personnelReport: Array<{
        name: string;
        role: string;
        status: string;
        notes?: string;
    }>;
    resourceEffects: string[];
};

function mapCategoryToFeedType(
    category: GameEvent["category"],
    informationTier?: GameEvent["informationTier"],
): FeedEntryType {
    if (informationTier === "intercepted_communication") return "intercept";
    if (informationTier === "intelligence_report") return "intel";
    switch (category) {
        case "combat":
            return "combat";
        case "evil_tier":
            return "landmark";
        case "death":
            return "internal";
        case "player_choice":
            return "internal";
        case "informational":
        default:
            return "news";
    }
}

function formatDay(day: number): string {
    return `DAY ${day}`;
}

export function useEvents() {
    const gameState = useGameState();
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const feedEntries: EventSummary[] = useMemo(
        () =>
            [...gameState.eventLog].reverse().map((record): EventSummary => {
                const event = record.event;
                return {
                    id: event.id,
                    day: record.resolvedOnDate,
                    date: formatDay(record.resolvedOnDate),
                    type: mapCategoryToFeedType(
                        event.category,
                        event.informationTier,
                    ),
                    title: event.title,
                    text: event.body,
                    unread: false,
                };
            }),
        [gameState.eventLog],
    );

    const pendingEvents: EventSummary[] = useMemo(
        () =>
            gameState.pendingEvents.map(
                (event): EventSummary => ({
                    id: event.id,
                    day: event.createdOnDate,
                    date: formatDay(event.createdOnDate),
                    type: mapCategoryToFeedType(
                        event.category,
                        event.informationTier,
                    ),
                    title: event.title,
                    text: event.body,
                    unread: true,
                }),
            ),
        [gameState.pendingEvents],
    );

    const aarEntries: AAREntry[] = useMemo(() => [], []);

    function selectEvent(id: string | null) {
        setSelectedEventId(id);
    }

    function clearSelection() {
        setSelectedEventId(null);
    }

    function getEnrichedById(id: string | null) {
        if (!id) return null;
        const fromFeed = feedEntries.find((e) => e.id === id);
        if (fromFeed) return fromFeed;
        const fromPending = pendingEvents.find((e) => e.id === id);
        if (fromPending) return fromPending;
        const fromAAR = aarEntries.find((a) => a.id === id);
        if (fromAAR) {
            return {
                id: fromAAR.id,
                day: 0,
                date: fromAAR.date,
                type: "landmark" as FeedEntryType,
                title: fromAAR.subject,
                text: fromAAR.executiveSummary,
                isAAR: true,
                aar: fromAAR,
            } as any;
        }
        return null;
    }

    return {
        feedEntries,
        pendingEvents,
        aarEntries,
        selectedEventId,
        selectEvent,
        clearSelection,
        getEnrichedById,
    } as const;
}

export default useEvents;
