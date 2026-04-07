import type {
    Tile,
    Zone,
    Nation,
    Building,
    Person,
    GoverningOrganization,
    EffectInstance,
    Squad,
} from "../types/index.js";
import { Prng } from "../worldGen/prng.js";

let _nextId = 1;
const nextId = (prefix: string) => `${prefix}-${_nextId++}`;

/** Reset the ID counter — used by worldgen to ensure deterministic IDs per run. */
export const resetIdCounter = (startValue = 1): void => {
    _nextId = startValue;
};

export const createTile = (
    overrides: Partial<Tile> & { zoneId: string; typeId: string },
): Tile => ({
    id: nextId("tile"),
    activeEffectIds: [],
    ...overrides,
});

export const createZone = (
    overrides: Partial<Zone> & {
        nationId: string;
        governingOrganizationId: string;
        name: string;
    },
): Zone => ({
    id: nextId("zone"),
    tileIds: [],
    buildingIds: [],
    generationWealth: 0,
    economicOutput: 0,
    population: 0,
    intelLevel: 0,
    taxRate: 0.1,
    activeEffectIds: [],
    ...overrides,
});

export const createNation = (
    overrides: Partial<Nation> & {
        name: string;
        governingOrganizationId: string;
    },
): Nation => ({
    id: nextId("nation"),
    size: 1,
    ...overrides,
});

export const createBuilding = (
    overrides: Partial<Building> & {
        name: string;
        typeId: string;
        zoneId: string;
        governingOrganizationId: string;
    },
): Building => ({
    id: nextId("building"),
    intelLevel: 0,
    activeEffectIds: [],
    ...overrides,
});

export const getRandomAttributeValue = (
    prng: Prng,
    min: number = 0,
    max: number = 100,
    modifier: number = 0,
): number => {
    let value = Math.floor(prng() * (max - min + 1)) + min + modifier; // min-max with modifier
    if (value < min) value = min;
    if (value > max) value = max;
    return value;
};

export const createPerson = (
    overrides: Partial<Person> & {
        name: string;
        zoneId: string;
        homeZoneId: string;
        governingOrganizationId: string;
    },
): Person => ({
    id: nextId("person"),
    attributes: {},
    skills: {},
    loyalties: {},
    intelLevel: 0,
    health: 100,
    money: 0,
    activeEffectIds: [],
    dead: false,
    ...overrides,
});

export const createGoverningOrganization = (
    overrides: Partial<GoverningOrganization> & { name: string },
): GoverningOrganization => ({
    id: nextId("go"),
    intelLevel: 0,
    activeEffectIds: [],
    ...overrides,
});

export const createSquad = (
    overrides: Partial<Squad> & { name: string },
): Squad => ({
    id: nextId("squad"),
    memberIds: [],
    ...overrides,
});

export const createEffectInstance = (
    overrides: Partial<EffectInstance> & {
        effectId: string;
        targetId: string;
        targetType: EffectInstance["targetType"];
        appliedOnDate: number;
    },
): EffectInstance => ({
    id: nextId("effect-inst"),
    ...overrides,
});
