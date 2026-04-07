import { useState } from "react";
import { TabBar } from "../../components/TabBar/TabBar";
import { Panel } from "../../components/Panel/Panel";
import useEvents from "../../hooks/useEvents";
import EventsList from "./EventsList";
import EventDetailPanel from "./EventDetailPanel";

type EventsTab = "feed" | "pending" | "aars";

const TABS = [
    { key: "feed", label: "FEED" },
    { key: "pending", label: "PENDING" },
    { key: "aars", label: "AFTER ACTION REPORTS" },
];

export function EventsScreen() {
    const [activeTab, setActiveTab] = useState<EventsTab>("feed");
    const {
        feedEntries,
        pendingEvents,
        aarEntries,
        selectedEventId,
        selectEvent,
        clearSelection,
        getEnrichedById,
    } = useEvents();

    return (
        <div>
            <div className="font-mono text-base text-text-primary mb-4 tracking-tight">
                EVENTS
            </div>

            <div className="flex gap-3" style={{ minHeight: "640px" }}>
                {/* Left — list */}
                <div
                    style={{ flex: "0 0 45%" }}
                    className="flex flex-col gap-3 min-w-0"
                >
                    <div className="border-b border-border-subtle">
                        <TabBar
                            tabs={TABS}
                            activeTab={activeTab}
                            onChange={(key) => {
                                setActiveTab(key as EventsTab);
                                clearSelection();
                            }}
                        />
                    </div>

                    <div className="overflow-y-auto">
                        <EventsList
                            tab={activeTab}
                            feedEntries={feedEntries}
                            pendingEvents={pendingEvents}
                            aarEntries={aarEntries}
                            selectedEventId={selectedEventId}
                            onSelectEvent={(id) => selectEvent(id)}
                        />
                    </div>
                </div>

                {/* Right — detail */}
                <div style={{ flex: "0 0 55%" }} className="overflow-y-auto">
                    <EventDetailPanel
                        enriched={getEnrichedById(selectedEventId)}
                    />
                </div>
            </div>
        </div>
    );
}

export default EventsScreen;
