import {
    Effect,
    GoverningOrganization,
    Nation,
    Person,
    Skill,
    Tile,
    TileType,
    Zone,
} from "../../common/types";

type CreateEffectParams = Effect;

export const createEffect = (params: CreateEffectParams): Effect => ({
    id: params.id,
    name: params.name,
    description: params.description,
    category: params.category,
});

type CreateSkillParams = {
    value: number;
    attributeCap: string;
};

export const createSkill = (params: CreateSkillParams): Skill => ({
    value: params.value,
    attributeCap: params.attributeCap,
});

type CreateGoverningOrganizationParams = Omit<
    GoverningOrganization,
    "intelLevel"
>;

export const GoverningOrganizationFactory = (
    params: CreateGoverningOrganizationParams,
): GoverningOrganization => ({
    id: params.id,
    name: params.name,
    intelLevel: 0,
    effects: params.effects,
});

export const NationFactory = (
    name: string,
    size: number,
    governingOrganizationId: string,
): Nation => ({
    name,
    size,
    governingOrganizationId,
});

export const TileFactory = (id: string, type: TileType): Tile => ({
    id,
    type,
});

type ZoneFactoryParams = Omit<
    Zone,
    "economicOutput" | "population" | "intelLevel"
>;

export const ZoneFactory = (params: ZoneFactoryParams): Zone => ({
    name: params.name,
    tiles: params.tiles,
    nationId: params.nationId,
    governingOrganizationId: params.governingOrganizationId,
    generationWealth: params.generationWealth,
    economicOutput: 0,
    population: 0,
    intelLevel: 0,
    effects: params.effects,
});

export const ScienceProjectFactory = (
    name: string,
    description: string,
    cost: number,
    scienceRequired: number, // in turns
    completionDays: number,
    skillDrivers: string[],
    prerequisites: string[],
    unlocks: string[],
) => ({
    name,
    description,
    cost,
    scienceRequired,
    completionDays,
    skillDrivers,
    prerequisites,
    unlocks,
});

type PersonFactoryParams = Pick<
    Person,
    "id" | "name" | "effects" | "skills" | "attributes"
>;

export const PersonFactory = (params: PersonFactoryParams): Person => ({
    name: params.name,
    effects: params.effects,
    id: params.id,
    skills: params.skills,
    attributes: params.attributes,
});
