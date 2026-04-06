// Config is validated once at engine initialization via Zod schemas.
// loadConfig reads all JSON files from the given directory and validates them.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import {
  ActivitiesSchema,
  BuildingsSchema,
  CitizenActionsSchema,
  CpuBehaviorsSchema,
  EffectsSchema,
  EvilTiersSchema,
  PersonAttributesSchema,
  PetsSchema,
  PlotsSchema,
  ResearchProjectsSchema,
  SkillsSchema,
  TileTypesSchema,
  WorldGenConfigSchema,
} from './schemas/index.js';
import type { ResearchProjectDefinition } from './schemas/index.js';
export type { ResearchProjectDefinition } from './schemas/index.js';

export type TileTypeDefinition = {
  icon: string;
  name: string;
  description: string;
  buildingRestrictions: string[];
  effects: string[];
  terrainConditions: {
    elevationMin: number;
    elevationMax: number;
    moistureMin: number;
    moistureMax: number;
    priority: number;
  };
  canBeInhabited: boolean;
  wealthContribution: number;
  isOcean?: boolean;
};

export type BuildingDefinition = {
  id: string;
  name: string;
  description: string;
  baseCost: { money?: number; science?: number; infrastructure?: number };
  capacity?: number;
  resourceOutput?: { money?: number; science?: number; infrastructure?: number };
  upkeepPerDay?: number;
  infrastructureLoad: number;
  preferredSkills: string[];
  wealthRequirement?: number;
  wealthWeight?: number;
  buildableOnTileTypes?: string[];
  effects?: string[];
};

export type PetDefinition = {
  id: string;
  name: string;
  description: string;
};

export type WorldGenConfigDefaults = z.infer<typeof WorldGenConfigSchema>;

export type Config = {
  tileTypes: Record<string, TileTypeDefinition>;
  buildings: BuildingDefinition[];
  pets: PetDefinition[];
  worldgen: WorldGenConfigDefaults;
  // Passthrough stubs — typed loosely until schemas are finalized
  activities: unknown[];
  citizenActions: unknown[];
  cpuBehaviors: unknown[];
  effects: unknown[];
  evilTiers: unknown[];
  personAttributes: unknown[];
  plots: unknown[];
  researchProjects: ResearchProjectDefinition[];
  skills: unknown[];
};

function readJson(dir: string, filename: string): unknown {
  const raw = readFileSync(join(dir, filename), 'utf-8');
  return JSON.parse(raw);
}

export function loadConfig(configDir: string): Config {
  return {
    tileTypes: TileTypesSchema.parse(readJson(configDir, 'tileTypes.json')) as Record<string, TileTypeDefinition>,
    buildings: BuildingsSchema.parse(readJson(configDir, 'buildings.json')) as BuildingDefinition[],
    pets: PetsSchema.parse(readJson(configDir, 'pets.json')) as PetDefinition[],
    worldgen: WorldGenConfigSchema.parse(readJson(configDir, 'worldgen.json')),
    activities: ActivitiesSchema.parse(readJson(configDir, 'activities.json')) as unknown[],
    citizenActions: CitizenActionsSchema.parse(readJson(configDir, 'citizenActions.json')) as unknown[],
    cpuBehaviors: CpuBehaviorsSchema.parse(readJson(configDir, 'cpuBehaviors.json')) as unknown[],
    effects: EffectsSchema.parse(readJson(configDir, 'effects.json')) as unknown[],
    evilTiers: EvilTiersSchema.parse(readJson(configDir, 'evilTiers.json')) as unknown[],
    personAttributes: PersonAttributesSchema.parse(readJson(configDir, 'personAttributes.json')) as unknown[],
    plots: PlotsSchema.parse(readJson(configDir, 'plots.json')) as unknown[],
    researchProjects: ResearchProjectsSchema.parse(readJson(configDir, 'researchProjects.json')) as ResearchProjectDefinition[],
    skills: SkillsSchema.parse(readJson(configDir, 'skills.json')) as unknown[],
  };
}
