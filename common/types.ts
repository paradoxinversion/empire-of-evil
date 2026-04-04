export interface Attribute {
    name: string;
    value: number;
}

export interface Skill {
    value: number;
    attributeCap: string;
}

export interface Effect {
    id: string;
    name: string;
    description: string;
    category: string;
}

export type TileType = {
    name: string;
    description: string;
    buildingRestrictions: string[];
    effects: Effect[];
};

export interface Tile {
    id: string;
    type: TileType;
}

// Key Entities

export interface GoverningOrganization {
    id: string;
    name: string;
    intelLevel: number;
    effects: Effect[];
}

export interface Nation {
    name: string;
    size: number;
    governingOrganizationId: string;
}

export interface Zone {
    name: string;
    tiles: Tile[];
    nationId: string;
    governingOrganizationId: string;
    generationWealth: number;
    economicOutput: number;
    population: number;
    intelLevel: number;
    effects: Effect[];
}

export interface ScienceProject {
    /** Humorous or euphemistic; written in dry corporate register */
    name: string;
    /** Factual; tells the player exactly what the project does and unlocks */
    description: string;
    /** One-time expenditure on project initiation */
    cost: number;
    /** Amount of science required to complete the project, in turns */
    scienceRequired: number; // in turns
    /** Base research time; reduced by assigned agent skill levels */
    completionDays: number;
    /** Which agent skills affect research speed and output quality */
    skillDrivers: string[];
    /** Names of other projects that must be completed first */
    prerequisites: string[];
    /** Names of things this project unlocks, e.g. plots, activities, etc. */
    unlocks: string[];
}

export interface Person {
    id: string;
    name: string;
    attributes: {
        [id: string]: Attribute;
    };
    skills: {
        [id: string]: Skill;
    };
    effects: Effect[];
}

export interface Building {
    name: string;
    intelLevel: number;
    effects: Effect[];
    governingOrganizationId: string;
}
