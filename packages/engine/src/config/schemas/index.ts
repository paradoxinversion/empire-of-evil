import { z } from 'zod';

// One schema per JSON config file in config/.
// Most are stubs (passthrough) until their config files are finalized.

export const ActivitiesSchema = z.array(z.object({}).passthrough());
const ResourceAmountSchema = z.object({
    money: z.number().optional(),
    science: z.number().optional(),
    infrastructure: z.number().optional(),
});

export const BuildingsSchema = z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    baseCost: ResourceAmountSchema,
    capacity: z.number().int().optional(),
    resourceOutput: ResourceAmountSchema.optional(),
    upkeepPerDay: z.number().optional(),
    infrastructureLoad: z.number(),
    preferredSkills: z.array(z.string()),
    wealthRequirement: z.number().optional(),
    wealthWeight: z.number().optional(),
    buildableOnTileTypes: z.array(z.string()).optional(),
    effects: z.array(z.string()).optional(),
}));
export const CitizenActionsSchema = z.array(z.object({}).passthrough());
export const CpuBehaviorsSchema = z.array(z.object({}).passthrough());
export const EffectsSchema = z.array(z.object({}).passthrough());
export const EvilTiersSchema = z.array(z.object({}).passthrough());
export const PersonAttributesSchema = z.array(z.object({}).passthrough());
export const PetsSchema = z.array(z.object({}).passthrough());
export const PlotsSchema = z.array(z.object({}).passthrough());
export const ResearchProjectsSchema = z.array(z.object({}).passthrough());
export const SkillsSchema = z.array(z.object({}).passthrough());
const TileTypeDefinitionSchema = z.object({
    name: z.string(),
    description: z.string(),
    buildingRestrictions: z.array(z.string()),
    effects: z.array(z.string()),
    terrainConditions: z.object({
        elevationMin: z.number().min(0).max(1),
        elevationMax: z.number().min(0).max(1),
        moistureMin: z.number().min(0).max(1),
        moistureMax: z.number().min(0).max(1),
        priority: z.number().int(),
    }),
    canBeInhabited: z.boolean(),
    wealthContribution: z.number().min(0).max(100),
    isOcean: z.boolean().optional(),
});

export const TileTypesSchema = z.record(z.string(), TileTypeDefinitionSchema);

export const WorldGenConfigSchema = z.object({
    mapWidth: z.number().int().positive(),
    mapHeight: z.number().int().positive(),
    terrainProfile: z.object({
        noiseScale: z.number().positive(),
        uninhabitedWealthFloor: z.number().min(0).max(100),
    }).optional(),
    minZoneSize: z.number().int().min(1),
    maxZoneSize: z.number().int().positive(),
    nationCount: z.number().int().positive(),
    zonesPerNation: z.number().int().min(3),
    minNationSpacing: z.number().int().positive().optional(),
    populationDensity: z.number().positive(),
    maxBuildingsPerZone: z.number().int().positive(),
});
