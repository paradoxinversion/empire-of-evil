import type {
    Building,
    GameEventRecord,
    GameState,
} from "@empire-of-evil/engine";
import {
    getBuildings,
    getEmpireTiles,
} from "../../../../engine/src/state/queries";
import type { BuildingRecord } from "./EmpireBuildingsTab";

type BuildingDefinitionLike = {
    id: string;
    name: string;
    resourceOutput?: {
        money?: number;
    };
    upkeepPerDay?: number;
};

export type EmpireOperationRecord = {
    id: string;
    operation: string;
    type: "plot" | "activity";
    target: string;
    agents: number;
    status: string;
    eta: string;
};

export type EmpireControlledZoneRecord = {
    id: string;
    zone: string;
    nation: string;
    empireTileCount: number;
    totalTileCount: number;
    output: number;
    status: "STABLE";
};

export type EmpireOverviewRecord = {
    empireZoneCount: number;
    agentCount: number;
    operations: EmpireOperationRecord[];
    controlledZones: EmpireControlledZoneRecord[];
    recentEvents: GameEventRecord[];
};

function getBuildingStatus(intelLevel: number): "SECURED" | "EXPOSED" {
    return intelLevel >= 2 ? "SECURED" : "EXPOSED";
}

export function deriveEmpireBuildings(
    gameState: GameState,
    buildingDefinitions: BuildingDefinitionLike[],
): BuildingRecord[] {
    const { empire } = gameState;
    const zones = gameState.zones ?? {};
    const tiles = gameState.tiles ?? {};
    const empireTileIds =
        gameState.tiles !== undefined && gameState.zones !== undefined
            ? new Set(getEmpireTiles(gameState))
            : new Set<string>();
    const buildingDefsById = new Map(
        buildingDefinitions.map((definition) => [definition.id, definition]),
    );

    return (
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
            };
        });
}

export function deriveEmpireOverview(
    gameState: GameState,
): EmpireOverviewRecord {
    const { empire } = gameState;
    const zones = gameState.zones ?? {};
    const nations = gameState.nations ?? {};
    const plots = gameState.plots ?? {};
    const activities = gameState.activities ?? {};
    const persons = gameState.persons ?? {};
    const eventLog = gameState.eventLog ?? [];
    const tiles = gameState.tiles ?? {};

    const empireZones = Object.values(zones).filter(
        (zone) => zone.governingOrganizationId === empire.id,
    );
    const empireTileIds =
        gameState.tiles !== undefined && gameState.zones !== undefined
            ? new Set(getEmpireTiles(gameState))
            : new Set<string>();

    return {
        empireZoneCount: empireZones.length,
        agentCount: Object.values(persons).filter(
            (person) => person.agentStatus !== undefined && !person.dead,
        ).length,
        operations: [
            ...Object.values(plots).map((plot) => ({
                id: plot.id,
                operation: plot.plotDefinitionId,
                type: "plot" as const,
                target: plot.targetZoneId ?? "—",
                agents: plot.assignedAgentIds.length,
                status: plot.status.toUpperCase(),
                eta: plot.daysRemaining > 0 ? `${plot.daysRemaining}d` : "—",
            })),
            ...Object.values(activities).map((activity) => ({
                id: activity.id,
                operation: activity.activityDefinitionId,
                type: "activity" as const,
                target: activity.zoneId,
                agents: activity.assignedAgentIds.length,
                status: "ACTIVE",
                eta: "—",
            })),
        ],
        controlledZones: empireZones.map((zone) => ({
            id: zone.id,
            zone: zone.name,
            nation: nations[zone.nationId]?.name ?? "—",
            empireTileCount: zone.tileIds.filter((tileId) =>
                empireTileIds.has(tileId),
            ).length,
            totalTileCount: zone.tileIds.filter(
                (tileId) => tiles[tileId] !== undefined,
            ).length,
            output: zone.economicOutput,
            status: "STABLE" as const,
        })),
        recentEvents: eventLog.slice(-5).reverse(),
    };
}
