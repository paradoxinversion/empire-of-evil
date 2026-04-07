import { useState } from "react";
import { TabBar } from "../../components/TabBar/TabBar";
import ActivitiesList from "./ActivitiesList";
import ActivityDetailPanel from "./ActivityDetailPanel";
import useActivities from "../../hooks/useActivities";

type ActivitiesTab = "available" | "active";

const TABS = [
    { key: "available", label: "AVAILABLE" },
    { key: "active", label: "ACTIVE" },
];

export function ActivitiesScreen() {
    const [activeTab, setActiveTab] = useState<ActivitiesTab>("available");
    const {
        activeActivities,
        availableActivities,
        availableAgents,
        unlockedResearchIds,
        selectedActivityId,
        selectActivity,
        getEnrichedById,
    } = useActivities();

    return (
        <div>
            <div className="font-mono text-base text-text-primary mb-4 tracking-tight">
                ACTIVITIES
            </div>

            <div className="flex gap-3" style={{ minHeight: "640px" }}>
                {/* Left — list */}
                <div
                    style={{ flex: "0 0 40%" }}
                    className="flex flex-col gap-3 min-w-0"
                >
                    <div className="border-b border-border-subtle">
                        <TabBar
                            tabs={TABS}
                            activeTab={activeTab}
                            onChange={(key) => {
                                setActiveTab(key as ActivitiesTab);
                                selectActivity(null);
                            }}
                        />
                    </div>

                    <div className="overflow-y-auto">
                        <ActivitiesList
                            tab={activeTab}
                            availableActivities={availableActivities}
                            activeActivities={activeActivities}
                            selectedActivityId={selectedActivityId}
                            onSelectActivity={(id) => selectActivity(id)}
                        />
                    </div>
                </div>

                {/* Right — detail */}
                <div style={{ flex: "0 0 60%" }} className="overflow-y-auto">
                    <ActivityDetailPanel
                        enriched={getEnrichedById(selectedActivityId)}
                        availableAgents={availableAgents}
                        unlockedResearchIds={unlockedResearchIds}
                    />
                </div>
            </div>
        </div>
    );
}

export default ActivitiesScreen;
