import type { Building } from "../../types/index.js";
import type { ZoneCandidate } from "../types.js";
import type { BuildingDefinition } from "../../config/loader.js";
import type { Prng } from "../prng.js";
import { createBuilding } from "../../factories/index.js";

export interface BuildingsResult {
    buildings: Record<string, Building>;
    /** zoneId → building IDs in that zone */
    zoneBuildingIds: Map<string, string[]>;
}

/**
 * Phase 8: Place buildings in inhabited zones using wealth-weighted selection.
 *
 * Building count per zone:
 *   floor(generationWealth / 100 * maxBuildingsPerZone * zoneSize / avgZoneSize)
 *
 * Restrictions:
 * - wealthRequirement: building only appears if zone.generationWealth >= requirement
 * - buildableOnTileTypes: if set, zone pluralityTypeId must be in the list
 * - 'headquarters' is reserved for Phase 9 — never placed here
 */
export function placeBuildings(
    zones: ZoneCandidate[],
    habitableZoneIds: Set<string>,
    zoneOrgMap: Record<string, string>,
    buildings: BuildingDefinition[],
    maxBuildingsPerZone: number,
    avgZoneSize: number,
    prng: Prng,
): BuildingsResult {
    const result: Record<string, Building> = {};
    const zoneBuildingIds = new Map<string, string[]>();

    for (const zone of zones) {
        const buildingIds: string[] = [];
        zoneBuildingIds.set(zone.id, buildingIds);

        if (!habitableZoneIds.has(zone.id)) continue;

        const zoneSize = zone.tileIds.length;
        const buildingCount = Math.floor(
            (zone.generationWealth / 100) *
                maxBuildingsPerZone *
                (zoneSize / avgZoneSize),
        );

        if (buildingCount === 0) continue;

        const eligible = buildings.filter((b) => {
            if (b.id === "headquarters") return false;
            if ((b.wealthRequirement ?? 0) > zone.generationWealth)
                return false;
            if (b.buildableOnTileTypes && b.buildableOnTileTypes.length > 0) {
                if (!b.buildableOnTileTypes.includes(zone.pluralityTypeId))
                    return false;
            }
            return true;
        });

        if (eligible.length === 0) continue;

        const govOrgId = zoneOrgMap[zone.id] ?? "";

        for (let i = 0; i < buildingCount; i++) {
            const selected = weightedDraw(eligible, prng);
            if (!selected) continue;

            // Pick a specific tile within the zone for this building (deterministic via PRNG)
            const tileId =
                zone.tileIds.length > 0
                    ? zone.tileIds[Math.floor(prng() * zone.tileIds.length)]
                    : undefined;

            const building = createBuilding({
                name: selected.name,
                typeId: selected.id,
                zoneId: zone.id,
                governingOrganizationId: govOrgId,
                tileId,
            });
            result[building.id] = building;
            buildingIds.push(building.id);
        }
    }

    return { buildings: result, zoneBuildingIds };
}

function weightedDraw(
    options: BuildingDefinition[],
    prng: Prng,
): BuildingDefinition | undefined {
    const totalWeight = options.reduce((s, b) => s + (b.wealthWeight ?? 1), 0);
    let roll = prng() * totalWeight;
    for (const opt of options) {
        roll -= opt.wealthWeight ?? 1;
        if (roll <= 0) return opt;
    }
    return options[options.length - 1];
}
