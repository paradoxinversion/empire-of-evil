import { useState } from "react";
import { TabBar } from "../../components/TabBar/TabBar";
import { Panel } from "../../components/Panel/Panel";
import usePlots from "../../hooks/usePlots";
import PlotsList from "./PlotsList";
import PlotDetailPanel from "./PlotDetailPanel";

type PlotsTab = "available" | "active";

const TABS = [
    { key: "available", label: "AVAILABLE" },
    { key: "active", label: "ACTIVE" },
];

export function PlotsScreen() {
    const [activeTab, setActiveTab] = useState<PlotsTab>("available");
    const {
        activePlots,
        availablePlots,
        availableAgents,
        unlockedResearchIds,
        selectedPlotId,
        selectPlot,
        getEnrichedById,
    } = usePlots();

    return (
        <div>
            <div className="font-mono text-base text-text-primary mb-4 tracking-tight">
                PLOTS
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
                                setActiveTab(key as PlotsTab);
                                setSelectedPlotId(null);
                            }}
                        />
                    </div>

                    <div className="overflow-y-auto">
                        <PlotsList
                            tab={activeTab}
                            availablePlots={availablePlots}
                            activePlots={activePlots}
                            selectedPlotId={selectedPlotId}
                            onSelectPlot={(id) => selectPlot(id)}
                        />
                    </div>
                </div>

                {/* Right — detail */}
                <div style={{ flex: "0 0 55%" }} className="overflow-y-auto">
                    <PlotDetailPanel
                        enriched={getEnrichedById(selectedPlotId)}
                        availableAgents={availableAgents}
                        unlockedResearchIds={unlockedResearchIds}
                    />
                </div>
            </div>
        </div>
    );
}

export default PlotsScreen;
