import { useMemo, useState } from "react";

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

export function useEvents() {
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const feedEntries: EventSummary[] = useMemo(
        () => [
            {
                id: "feed-1",
                day: 50,
                date: "17 MARCH, YEAR 1",
                type: "internal",
                title: "Empire Established",
                text: "The empire has been formally established. A small ceremony took place at the central command.",
                unread: false,
            },
            {
                id: "feed-2",
                day: 49,
                date: "16 MARCH, YEAR 1",
                type: "research",
                title: "Research Complete — Hypno Disco Ball",
                text: "The research division completed the Hypno Disco Ball project. Further testing recommended.",
                unread: true,
            },
        ],
        [],
    );

    const pendingEvents: EventSummary[] = useMemo(
        () => [
            {
                id: "pending-1",
                day: 51,
                date: "18 MARCH, YEAR 1",
                type: "combat",
                title: "Combat Engagement — Zone 12",
                text: "Forces reported contact with hostile organization in Zone 12. Immediate response required.",
                unread: true,
            },
        ],
        [],
    );

    const aarEntries: AAREntry[] = useMemo(
        () => [
            {
                id: "aar-1",
                subject: "Operation Nightfall",
                date: "DAY 46 — 13 MARCH, YEAR 1",
                status: "SUCCESS",
                executiveSummary:
                    "Operation Nightfall secured the objective with minimal collateral.",
                operationalLog: [
                    "Deploy squad",
                    "Engage enemy",
                    "Secure objective",
                    "Exfiltrate to base",
                ],
                personnelReport: [
                    {
                        name: "Agent K",
                        role: "Operative",
                        status: "Injured",
                        notes: "Shrapnel wound to left arm",
                    },
                ],
                resourceEffects: ["+ $1,200", "+ EVIL: +4"],
            },
        ],
        [],
    );

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
