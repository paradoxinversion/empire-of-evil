import { useState } from "react";
import type { Building } from "@empire-of-evil/engine";
import { useGameState } from "../../hooks/useGameState";
import { Tag } from "../../components/Tag/Tag";
import { TabBar } from "../../components/TabBar/TabBar";
import { BUNDLED_CONFIG } from "../../store/gameStore";
import { EmpireBuildingsTab, type BuildingRecord } from "./EmpireBuildingsTab";
import { EmpireOverviewTab } from "./EmpireOverviewTab";
import { getEvilTier, getEvilTierProgress } from "../../utils/evilTier";
import type { Row } from "../../components/DataTable/DataTable";
import {
    getBuildings,
    getEmpireTiles,
} from "../../../../engine/src/state/queries";

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

function getBuildingStatus(intelLevel: number): "SECURED" | "EXPOSED" {
    return intelLevel >= 2 ? "SECURED" : "EXPOSED";
}

export function EmpireScreen() {
    const [activeTab, setActiveTab] = useState<EmpireTab>("overview");

    const gameState = useGameState();
    const {
        empire,
        zones,
        plots,
        activities,
        persons,
        eventLog,
        nations,
        tiles,
    } = gameState;
    const { resources, evil } = empire;

    const tier = getEvilTier(evil.perceived);
    const tierProgress = getEvilTierProgress(evil.perceived);

    const empireZones = Object.values(zones).filter(
        (z) => z.governingOrganizationId === empire.id,
    );
    const hasTileAndZoneState =
        gameState.tiles !== undefined && gameState.zones !== undefined;
    const empireTileIds = hasTileAndZoneState
        ? new Set(getEmpireTiles(gameState))
        : new Set<string>();

    const buildingDefsById = new Map(
        BUNDLED_CONFIG.buildings.map((buildingDef) => [
            buildingDef.id,
            buildingDef,
        ]),
    );

    const empireBuildings = (
        gameState.buildings
            ? (getBuildings(gameState, {
                  governingOrganizationId: empire.id,
              }) as Building[])
            : []
    )
        .filter((building) => {
            if (building.tileId) {
                return empireTileIds.has(building.tileId);
            }
            return (
                zones[building.zoneId]?.governingOrganizationId === empire.id
            );
        })
        .map((building) => {
            const zoneIdFromTile = building.tileId
                ? tiles[building.tileId]?.zoneId
                : undefined;
            const zoneId = zoneIdFromTile ?? building.zoneId;
            const zone = zones[zoneId];
            const definition = buildingDefsById.get(building.typeId);
            return {
                id: building.id,
                name: building.name,
                typeName: definition?.name ?? building.typeId,
                zoneName: zone?.name ?? zoneId,
                tileLabel: building.tileId ?? "—",
                outputMoney: definition?.resourceOutput?.money ?? 0,
                upkeep: definition?.upkeepPerDay ?? 0,
                intelLevel: building.intelLevel,
                status: getBuildingStatus(building.intelLevel),
            } as BuildingRecord;
        });

    const agentCount = Object.values(persons).filter(
        (p) => p.agentStatus !== undefined && !p.dead,
    ).length;

    // Operations table rows
    const plotRows: Row[] = Object.values(plots).map((p) => ({
        _key: p.id,
        operation: p.plotDefinitionId,
        type: <Tag variant="plot">PLOT</Tag>,
        target: p.targetZoneId ?? "—",
        agents: String(p.assignedAgentIds.length),
        status: p.status.toUpperCase(),
        eta: p.daysRemaining > 0 ? `${p.daysRemaining}d` : "—",
    }));
    const activityRows: Row[] = Object.values(activities).map((a) => ({
        _key: a.id,
        operation: a.activityDefinitionId,
        type: <Tag variant="activity">ACTIVITY</Tag>,
        target: a.zoneId,
        agents: String(a.assignedAgentIds.length),
        status: "ACTIVE",
        eta: "—",
    }));
    const operationsRows = [...plotRows, ...activityRows];

    // Controlled zones table rows
    const zoneRows: Row[] = empireZones.map((z) => ({
        _key: z.id,
        zone: z.name,
        nation: nations[z.nationId]?.name ?? "—",
        tiles: `${
            getEmpireTiles(gameState).filter(
                (tileId) => zones[gameState.tiles[tileId].zoneId]?.id === z.id,
            ).length
        } / ${z.tileIds.length}`,
        output: formatMoney(z.economicOutput),
        status: <Tag variant="stable">STABLE</Tag>,
    }));

    // Recent activity feed (last 5 resolved events)
    const recentEvents = eventLog.slice(-5).reverse();

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
                    empireZoneCount={empireZones.length}
                    agentCount={agentCount}
                    operationsRows={operationsRows}
                    zoneRows={zoneRows}
                    recentEvents={recentEvents}
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
