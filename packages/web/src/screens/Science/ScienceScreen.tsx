import { useState } from "react";
import { TabBar } from "../../components/TabBar/TabBar";
import { Panel } from "../../components/Panel/Panel";
import { StatWidget } from "../../components/StatWidget/StatWidget";
import { useResearch } from "../../hooks/useResearch.js";
import { ResearchTreeTab } from "./ResearchTreeTab.js";
import { ActiveResearchTab } from "./ActiveResearchTab.js";
import { ResearchDetailPanel } from "./ResearchDetailPanel.js";

type ScienceTab = "tree" | "active" | "laboratories";

const TABS = [
    { key: "tree", label: "RESEARCH TREE" },
    { key: "active", label: "ACTIVE" },
    { key: "laboratories", label: "LABORATORIES" },
];

export function ScienceScreen() {
    const [activeTab, setActiveTab] = useState<ScienceTab>("tree");
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
        null,
    );

    const {
        projectsByBranch,
        activeResearches,
        completedCount,
        scienceBalance,
        availableScientists,
    } = useResearch();

    const allProjects = Object.values(projectsByBranch).flat();

    const selectedProject = selectedProjectId
        ? (allProjects.find((ep) => ep.definition.id === selectedProjectId) ??
          null)
        : null;

    const handleSelectProject = (projectId: string) => {
        setSelectedProjectId(
            projectId === selectedProjectId ? null : projectId,
        );
    };

    return (
        <div>
            <div className="font-mono text-base text-text-primary mb-4 tracking-tight">
                SCIENCE
            </div>

            {/* Stat row */}
            <div className="flex gap-2 mb-4">
                <StatWidget
                    label="SCIENCE BALANCE"
                    value={scienceBalance.toLocaleString()}
                />
                <StatWidget
                    label="ACTIVE PROJECTS"
                    value={String(activeResearches.length)}
                />
                <StatWidget
                    label="COMPLETED"
                    value={String(completedCount)}
                    subValue={`of ${allProjects.length} total`}
                    subVariant="neutral"
                />
                <StatWidget
                    label="SCIENTISTS IDLE"
                    value={String(availableScientists.length)}
                    subVariant={
                        availableScientists.length > 0 ? "warning" : "neutral"
                    }
                />
            </div>

            <div className="flex gap-3" style={{ minHeight: "640px" }}>
                {/* Left — list */}
                <div
                    style={{ flex: "0 0 55%" }}
                    className="flex flex-col gap-3 min-w-0"
                >
                    <div className="border-b border-border-subtle">
                        <TabBar
                            tabs={TABS}
                            activeTab={activeTab}
                            onChange={(key) => {
                                setActiveTab(key as ScienceTab);
                                setSelectedProjectId(null);
                            }}
                        />
                    </div>

                    <div className="overflow-y-auto">
                        {activeTab === "tree" && (
                            <ResearchTreeTab
                                projectsByBranch={projectsByBranch}
                                onSelectProject={handleSelectProject}
                                selectedProjectId={selectedProjectId}
                                allProjects={allProjects}
                            />
                        )}
                        {activeTab === "active" && (
                            <ActiveResearchTab
                                activeResearches={activeResearches}
                                onSelectProject={handleSelectProject}
                                selectedProjectId={selectedProjectId}
                            />
                        )}
                    </div>
                </div>

                {/* Right — detail */}
                <div style={{ flex: "0 0 45%" }} className="overflow-y-auto">
                    {selectedProject ? (
                        <ResearchDetailPanel
                            ep={selectedProject}
                            availableScientists={availableScientists}
                            allProjects={allProjects}
                        />
                    ) : (
                        <Panel>
                            <div className="text-text-muted text-[11px]">
                                Select a research project to view details.
                            </div>
                        </Panel>
                    )}
                </div>
            </div>
        </div>
    );
}
