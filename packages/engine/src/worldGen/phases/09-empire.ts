import type { Person, Building } from "../../types/index.js";
import type {
    AttributeDefinition,
    PetDefinition,
} from "../../config/loader.js";
import {
    createPerson,
    createBuilding,
    getRandomAttributeValue,
} from "../../factories/index.js";
import { Prng, seedFrom } from "../prng.js";

const STARTING_LOYALTY = 65;
const STARTING_AGENT_COUNT = 10;
const STARTING_AGENT_LOYALTY = 80;

interface EmpireInitParams {
    petTypeId?: string;
    startingResources?: {
        money: number;
        science: number;
        infrastructure: number;
    };
}

export interface EmpireInitResult {
    persons: Record<string, Person>;
    buildings: Record<string, Building>;
    overlordId: string;
    petId: string;
    hqBuildingId: string;
    resources: { money: number; science: number; infrastructure: number };
    empireId: string;
}

/**
 * Phase 9: Initialize the empire starting zone.
 *
 * Places:
 * - Headquarters building
 * - Overlord person (with agentStatus: { job: 'unassigned', salary: 0 })
 * - Pet person (matched by petTypeId or randomly selected)
 *
 * Sets starting resources from params or config defaults.
 */
export function initializeEmpire(
    empireOriginZoneId: string,
    empireOriginTile: string,
    empireOrgId: string,
    pets: PetDefinition[],
    params: EmpireInitParams,
    defaultResources: {
        money: number;
        science: number;
        infrastructure: number;
    },
    worldSeed: number,
    populationPersons: Record<string, Person> = {},
    prng: Prng,
    attributes: AttributeDefinition[] = [],
    skills: AttributeDefinition[] = [],
): EmpireInitResult {
    const persons: Record<string, Person> = {};
    const buildings: Record<string, Building> = {};

    // Headquarters
    const hq = createBuilding({
        name: "Headquarters",
        typeId: "headquarters",
        zoneId: empireOriginZoneId,
        governingOrganizationId: empireOrgId,
    });
    buildings[hq.id] = hq;

    // Overlord
    const overlord = createPerson({
        name: "The Overlord",
        zoneId: empireOriginZoneId,
        homeZoneId: empireOriginZoneId,
        governingOrganizationId: empireOrgId,
        loyalties: { [empireOrgId]: 100 },
        agentStatus: { job: "unassigned", salary: 0 },
    });
    overlord.attributes = Object.fromEntries(
        attributes.map((attr) => [
            attr.id,
            getRandomAttributeValue(prng, 10, 100, 25), // Overlord starts with higher attributes on average
        ]),
    );
    overlord.skills = Object.fromEntries(
        skills.map((skill) => [
            skill.id,
            getRandomAttributeValue(prng, 10, 100, 20), // Overlord starts with higher skills on average
        ]),
    );
    persons[overlord.id] = overlord;

    // Pet selection
    let selectedPet: PetDefinition | undefined;
    if (params.petTypeId) {
        selectedPet = pets.find((p) => p.id === params.petTypeId);
    }
    if (!selectedPet && pets.length > 0) {
        // Deterministic random selection from worldSeed
        const { prng } = seedFrom(worldSeed ^ 0xdeadbeef);
        selectedPet = pets[Math.floor(prng() * pets.length)];
    }

    const petPerson = createPerson({
        name: selectedPet?.name ?? "Unnamed Pet",
        zoneId: empireOriginZoneId,
        homeZoneId: empireOriginZoneId,
        governingOrganizationId: empireOrgId,
    });

    persons[petPerson.id] = petPerson;

    const resources = params.startingResources ?? defaultResources;

    // Subject setup: all zone citizens become empire subjects
    const allZoneCitizens = Object.values(populationPersons).filter(
        (p) => p.zoneId === empireOriginZoneId,
    );

    for (const citizen of allZoneCitizens) {
        persons[citizen.id] = {
            ...citizen,
            governingOrganizationId: empireOrgId,
            loyalties: {
                ...citizen.loyalties,
                [empireOrgId]: STARTING_LOYALTY,
            },
        };
    }

    // Agent recruitment: living citizens only, seeded shuffle, take up to STARTING_AGENT_COUNT
    const livingZoneCitizens = allZoneCitizens.filter((p) => !p.dead);
    const { prng: recruitPrng } = seedFrom(worldSeed ^ 0xf00dcafe);
    const shuffled = [...livingZoneCitizens].sort(() => recruitPrng() - 0.5);
    const recruits = shuffled.slice(0, STARTING_AGENT_COUNT);

    for (const recruit of recruits) {
        persons[recruit.id] = {
            ...persons[recruit.id]!,
            loyalties: {
                ...recruit.loyalties,
                [empireOrgId]: STARTING_AGENT_LOYALTY,
            },
            agentStatus: { job: "unassigned", salary: 0 },
        };
    }

    return {
        persons,
        buildings,
        overlordId: overlord.id,
        petId: petPerson.id,
        hqBuildingId: hq.id,
        resources,
        empireId: empireOrgId,
    };
}
