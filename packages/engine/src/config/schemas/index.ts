import { z } from "zod";

// One schema per JSON config file in config/.
// Most are stubs (passthrough) until their config files are finalized.

export const ActivitiesSchema = z.array(z.object({}).passthrough());
const ResourceAmountSchema = z.object({
    money: z.number().optional(),
    science: z.number().optional(),
    infrastructure: z.number().optional(),
});

export const BuildingsSchema = z.array(
    z.object({
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
    }),
);
export const CitizenActionsSchema = z.array(z.object({}).passthrough());
export const CpuBehaviorsSchema = z.array(z.object({}).passthrough());

const EventCategorySchema = z.union([
    z.literal("combat"),
    z.literal("death"),
    z.literal("player_choice"),
    z.literal("evil_tier"),
    z.literal("informational"),
]);

const EventPresentationTierSchema = z.union([
    z.literal("notification"),
    z.literal("event"),
    z.literal("landmark"),
]);

const EventInformationTierSchema = z.union([
    z.literal("news_feed"),
    z.literal("intelligence_report"),
    z.literal("intercepted_communication"),
]);

const EventRecurrenceSchema = z.union([
    z.literal("once"),
    z.literal("recurring"),
]);

const EventEffectSchema = z
    .object({
        type: z.string(),
        chance: z.number().min(0).max(1),
        parameters: z.record(z.unknown()).optional(),
    })
    .strict();

const EventChoiceSchema = z
    .object({
        label: z.string().min(1),
        effects: z.array(EventEffectSchema),
    })
    .strict();

const EventTriggerSchema = z.discriminatedUnion("type", [
    z
        .object({
            type: z.literal("daily_chance"),
            chance: z.number().min(0).max(1),
        })
        .strict(),
    z
        .object({
            type: z.literal("resource_below"),
            resource: z.union([
                z.literal("money"),
                z.literal("science"),
                z.literal("infrastructure"),
            ]),
            threshold: z.number(),
        })
        .strict(),
    z
        .object({
            type: z.literal("evil_perceived_at_least"),
            threshold: z.number().min(0).max(100),
        })
        .strict(),
]);

export const EventDefinitionSchema = z
    .object({
        id: z.string().min(1),
        category: EventCategorySchema,
        presentationTier: EventPresentationTierSchema,
        informationTier: EventInformationTierSchema,
        title: z.string().min(1),
        body: z.string().min(1),
        requiresResolution: z.boolean(),
        recurrence: EventRecurrenceSchema,
        trigger: EventTriggerSchema,
        relatedEntityIds: z.array(z.string()).optional(),
        choices: z.array(EventChoiceSchema).optional(),
    })
    .strict();

export const EventsSchema = z.array(EventDefinitionSchema);
export type EventDefinition = z.infer<typeof EventDefinitionSchema>;

export const EffectsSchema = z.array(z.object({}).passthrough());
export const EvilTiersSchema = z.array(z.object({}).passthrough());
export const PersonAttributesSchema = z.array(
    z.object({
        id: z.string(),
        name: z.string(),
    }),
);
export const PetsSchema = z.array(z.object({}).passthrough());
export const PlotsSchema = z.array(z.object({}).passthrough());
const ResearchUnlocksSchema = z.object({
    researchIds: z.array(z.string()),
    activityIds: z.array(z.string()),
    plotIds: z.array(z.string()),
    effectIds: z.array(z.string()),
});

export const ResearchProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    branch: z.string(),
    cost: z.number(),
    scienceRequired: z.number(),
    completionDays: z.number().int().positive(),
    prerequisites: z.array(z.string()),
    skillDrivers: z.array(z.string()),
    unlocks: ResearchUnlocksSchema,
});

export const ResearchProjectsSchema = z.array(ResearchProjectSchema);
export type ResearchProjectDefinition = z.infer<typeof ResearchProjectSchema>;
export const SkillsSchema = z.array(
    z.object({
        id: z.string(),
        attributeCap: z.string(),
        name: z.string(),
    }),
);

const TileTypeDefinitionSchema = z.object({
    icon: z.string(),
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
    governingOrganizationId: z.string(),
});

export const TileTypesSchema = z.record(z.string(), TileTypeDefinitionSchema);

export const WorldGenConfigSchema = z.object({
    mapWidth: z.number().int().positive(),
    mapHeight: z.number().int().positive(),
    terrainProfile: z
        .object({
            noiseScale: z.number().positive(),
            uninhabitedWealthFloor: z.number().min(0).max(100),
        })
        .optional(),
    minZoneSize: z.number().int().min(1),
    maxZoneSize: z.number().int().positive(),
    nationCount: z.number().int().positive(),
    zonesPerNation: z.number().int().min(3),
    minNationSpacing: z.number().int().positive().optional(),
    populationDensity: z.number().positive(),
    maxBuildingsPerZone: z.number().int().positive(),
});
