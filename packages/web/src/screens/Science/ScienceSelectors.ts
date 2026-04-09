import type { Building, GameState, Person } from "@empire-of-evil/engine";
import {
    getBuildings,
    getEmpireTiles,
} from "../../../../engine/src/state/queries";

type BuildingDefinitionLike = {
    id: string;
    name: string;
    description?: string;
    capacity?: number;
    preferredSkills?: string[];
    resourceOutput?: {
        science?: number;
    };
    upkeepPerDay?: number;
};

export type LaboratoryRecord = {
    id: string;
    name: string;
    typeName: string;
    zoneName: string;
    tileLabel: string;
    outputScience: number;
    upkeep: number;
    intelLevel: number;
    status: "SECURED" | "EXPOSED";
};

export type LaboratoryDetailRecord = LaboratoryRecord & {
    buildingId: string;
    description: string;
    capacity: number;
    preferredSkills: string[];
    assignedScientists: Person[];
    availableScientists: Person[];
};

function getBuildingStatus(intelLevel: number): "SECURED" | "EXPOSED" {
    return intelLevel >= 2 ? "SECURED" : "EXPOSED";
}

function getScienceTypeIds(
    buildingDefinitions: BuildingDefinitionLike[],
): Set<string> {
    return new Set(
        buildingDefinitions
            .filter(
                (definition) => (definition.resourceOutput?.science ?? 0) > 0,
            )
            .map((definition) => definition.id),
    );
}

function getOtherBuildingAssignedIds(
    gameState: GameState,
    selectedBuildingId: string,
): Set<string> {
    return new Set(
        Object.values(gameState.buildings ?? {})
            .filter((building) => building.id !== selectedBuildingId)
            .flatMap((building) => building.assignedAgentIds ?? []),
    );
}

export function deriveScienceLaboratories(
    gameState: GameState,
    buildingDefinitions: BuildingDefinitionLike[],
): LaboratoryRecord[] {
    const scienceTypeIds = getScienceTypeIds(buildingDefinitions);
    const buildingDefsById = new Map(
        buildingDefinitions.map((definition) => [definition.id, definition]),
    );

    const { empire } = gameState;
    const zones = gameState.zones ?? {};
    const tiles = gameState.tiles ?? {};
    const empireTileIds =
        gameState.tiles !== undefined && gameState.zones !== undefined
            ? new Set(getEmpireTiles(gameState))
            : new Set<string>();

    return (
        gameState.buildings
            ? (getBuildings(gameState, {
                  governingOrganizationId: empire.id,
              }) as Building[])
            : []
    )
        .filter((building) => scienceTypeIds.has(building.typeId))
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
                outputScience: definition?.resourceOutput?.science ?? 0,
                upkeep: definition?.upkeepPerDay ?? 0,
                intelLevel: building.intelLevel,
                status: getBuildingStatus(building.intelLevel),
            };
        });
}

export function deriveScienceLaboratoryDetail(
    gameState: GameState,
    buildingId: string | null,
    buildingDefinitions: BuildingDefinitionLike[],
): LaboratoryDetailRecord | null {
    if (!buildingId) {
        return null;
    }

    const building = gameState.buildings[buildingId];
    if (!building) {
        return null;
    }

    const summary = deriveScienceLaboratories(
        gameState,
        buildingDefinitions,
    ).find((record) => record.id === buildingId);
    if (!summary) {
        return null;
    }

    const definition = buildingDefinitions.find(
        (entry) => entry.id === building.typeId,
    );

    const assignedAgentIds = building.assignedAgentIds ?? [];
    const assignedScientists = assignedAgentIds
        .map((agentId) => gameState.persons[agentId])
        .filter(
            (person): person is Person =>
                Boolean(person) &&
                !person.dead &&
                person.agentStatus?.job === "scientist",
        );

    const plotAssignedIds = new Set(
        Object.values(gameState.plots ?? {}).flatMap(
            (plot) => plot.assignedAgentIds ?? [],
        ),
    );
    const activityAssignedIds = new Set(
        Object.values(gameState.activities ?? {}).flatMap(
            (activity) => activity.assignedAgentIds ?? [],
        ),
    );
    const researchAssignedIds = new Set(
        Object.values(gameState.research ?? {}).flatMap(
            (research) => research.assignedAgentIds ?? [],
        ),
    );
    const otherBuildingAssignedIds = getOtherBuildingAssignedIds(
        gameState,
        buildingId,
    );

    const availableScientists = Object.values(gameState.persons ?? {}).filter(
        (person) => {
            if (!person.agentStatus || person.dead) {
                return false;
            }

            if (person.agentStatus.job !== "scientist") {
                return false;
            }

            if (assignedAgentIds.includes(person.id)) {
                return false;
            }

            if (
                plotAssignedIds.has(person.id) ||
                activityAssignedIds.has(person.id) ||
                researchAssignedIds.has(person.id) ||
                otherBuildingAssignedIds.has(person.id)
            ) {
                return false;
            }

            return true;
        },
    );

    return {
        buildingId: building.id,
        ...summary,
        description:
            definition?.description ?? "No laboratory intelligence available.",
        capacity: definition?.capacity ?? 0,
        preferredSkills: definition?.preferredSkills ?? [],
        assignedScientists,
        availableScientists,
    };
}
