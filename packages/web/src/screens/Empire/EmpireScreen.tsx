import { useState } from "react";
import { useGameState } from "../../hooks/useGameState";
import { Tag } from "../../components/Tag/Tag";
import { TabBar } from "../../components/TabBar/TabBar";
import { BUNDLED_CONFIG } from "../../store/gameStore";
import { EmpireBuildingsTab } from "./EmpireBuildingsTab";
import { EmpireOverviewTab } from "./EmpireOverviewTab";
import { getEvilTier, getEvilTierProgress } from "../../utils/evilTier";
import type { Row } from "../../components/DataTable/DataTable";
import { deriveEmpireBuildings, deriveEmpireOverview } from "./EmpireSelectors";

function formatMoney(n: number): string {
    return "$" + n.toLocaleString("en-US");
}

const OPERATIONS_COLUMNS = [
    { key: "operation", label: "OPERATION" },
    { key: "type", label: "TYPE" },
    { key: "target", label: "TARGET" },
    { key: "agents", label: "AGENTS" },
    { key: "status", label: "STATUS" },
    { key: "eta", label: "ETA" },
];

const ZONES_COLUMNS = [
    { key: "zone", label: "ZONE", sortable: true },
    { key: "nation", label: "NATION", sortable: true },
    { key: "tiles", label: "TILES" },
    { key: "output", label: "OUTPUT", sortable: true },
    { key: "status", label: "STATUS" },
];

type EmpireTab = "overview" | "buildings";

const EMPIRE_TABS = [
    { key: "overview", label: "OVERVIEW" },
    { key: "buildings", label: "BUILDINGS" },
];

export function EmpireScreen() {
    const [activeTab, setActiveTab] = useState<EmpireTab>("overview");

    const gameState = useGameState();
    const { empire } = gameState;
    const { resources, evil } = empire;

    const tier = getEvilTier(evil.perceived);
    const tierProgress = getEvilTierProgress(evil.perceived);
    const overview = deriveEmpireOverview(gameState);
    const empireBuildings = deriveEmpireBuildings(
        gameState,
        BUNDLED_CONFIG.buildings,
    );

    // Operations table rows
    const operationsRows: Row[] = overview.operations.map((operation) => ({
        _key: operation.id,
        operation: operation.operation,
        type:
            operation.type === "plot" ? (
                <Tag variant="plot">PLOT</Tag>
            ) : (
                <Tag variant="activity">ACTIVITY</Tag>
            ),
        target: operation.target,
        agents: String(operation.agents),
        status: operation.status,
        eta: operation.eta,
    }));

    // Controlled zones table rows
    const zoneRows: Row[] = overview.controlledZones.map((zone) => ({
        _key: zone.id,
        zone: zone.zone,
        nation: zone.nation,
        tiles: `${zone.empireTileCount} / ${zone.totalTileCount}`,
        output: formatMoney(zone.output),
        status: <Tag variant="stable">{zone.status}</Tag>,
    }));

    return (
        <div>
            <TabBar
                tabs={EMPIRE_TABS}
                activeTab={activeTab}
                onChange={(key) => setActiveTab(key as EmpireTab)}
            />

            {activeTab === "overview" && (
                <EmpireOverviewTab
                    money={resources.money}
                    science={resources.science}
                    perceivedEvil={evil.perceived}
                    evilTierName={tier.name}
                    evilTierColor={tier.color}
                    evilTierProgress={tierProgress}
                    empireZoneCount={overview.empireZoneCount}
                    agentCount={overview.agentCount}
                    operationsRows={operationsRows}
                    zoneRows={zoneRows}
                    recentEvents={overview.recentEvents}
                    operationsColumns={OPERATIONS_COLUMNS}
                    zonesColumns={ZONES_COLUMNS}
                />
            )}

            {activeTab === "buildings" && (
                <EmpireBuildingsTab buildings={empireBuildings} />
            )}
        </div>
    );
}
