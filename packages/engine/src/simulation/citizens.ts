import type { GameState } from "../types/index.js";
import { getBuildingZoneId } from "../state/queries.js";

export const simulateCitizens = (state: GameState): void => {
    for (const person of Object.values(state.persons)) {
        if (person.dead || person.agentStatus) {
            if ("employedBuildingId" in person) {
                delete person.employedBuildingId;
            }
            continue;
        }

        const building = Object.values(state.buildings).find((candidate) => {
            if (
                candidate.governingOrganizationId !==
                person.governingOrganizationId
            ) {
                return false;
            }
            return getBuildingZoneId(state, candidate) === person.zoneId;
        });

        if (!building) {
            if ("employedBuildingId" in person) {
                delete person.employedBuildingId;
            }
            continue;
        }

        person.employedBuildingId = building.id;
    }
};
