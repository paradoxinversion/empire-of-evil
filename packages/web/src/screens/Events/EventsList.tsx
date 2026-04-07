import React from "react";
import { FeedEntry } from "../../components/FeedEntry/FeedEntry";
import type { EventSummary } from "../../hooks/useEvents";

type EventsListProps = {
    tab: "feed" | "pending" | "aars";
    feedEntries: EventSummary[];
    pendingEvents: EventSummary[];
    aarEntries: any[];
    selectedEventId: string | null;
    onSelectEvent: (id: string) => void;
};

export default function EventsList({
    tab,
    feedEntries,
    pendingEvents,
    aarEntries,
    selectedEventId,
    onSelectEvent,
}: EventsListProps) {
    if (tab === "feed") {
        return (
            <div>
                {feedEntries.map((e) => (
                    <div
                        key={e.id}
                        className={`cursor-pointer ${selectedEventId === e.id ? "bg-bg-selected" : ""}`}
                        onClick={() => onSelectEvent(e.id)}
                    >
                        <FeedEntry
                            day={e.day}
                            text={e.text}
                            type={e.type as any}
                            unread={e.unread}
                        />
                    </div>
                ))}
            </div>
        );
    }

    if (tab === "pending") {
        return (
            <div>
                {pendingEvents.map((p) => (
                    <div
                        key={p.id}
                        className={`flex items-center justify-between py-2 px-2 border-b border-bg-elevated ${
                            selectedEventId === p.id ? "bg-bg-selected" : ""
                        }`}
                    >
                        <div
                            className="flex-1 cursor-pointer"
                            onClick={() => onSelectEvent(p.id)}
                        >
                            <div className="font-mono text-xs text-text-primary">
                                {p.title}
                            </div>
                            <div className="text-[11px] text-text-secondary truncate">
                                {p.text}
                            </div>
                        </div>
                        <div className="ml-3">
                            <button
                                className="text-xs px-2 py-1 rounded-sm border border-border-subtle text-text-primary bg-bg-elevated/60"
                                disabled
                            >
                                RESOLVE
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // AARs
    return (
        <div>
            {aarEntries.map((a) => (
                <div
                    key={a.id}
                    className={`cursor-pointer py-2 px-2 border-b border-bg-elevated ${selectedEventId === a.id ? "bg-bg-selected" : ""}`}
                    onClick={() => onSelectEvent(a.id)}
                >
                    <div className="font-mono text-xs text-text-primary">
                        {a.subject}
                    </div>
                    <div className="text-[11px] text-text-secondary truncate">
                        {a.executiveSummary}
                    </div>
                </div>
            ))}
        </div>
    );
}
