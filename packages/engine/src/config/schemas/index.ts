import { z } from 'zod';

// Stub schemas — will be replaced with strict Zod schemas per config file.
// One schema per JSON config file in config/.

export const ActivitiesSchema = z.array(z.object({}).passthrough());
export const BuildingsSchema = z.array(z.object({}).passthrough());
export const CitizenActionsSchema = z.array(z.object({}).passthrough());
export const CpuBehaviorsSchema = z.array(z.object({}).passthrough());
export const EffectsSchema = z.array(z.object({}).passthrough());
export const EvilTiersSchema = z.array(z.object({}).passthrough());
export const PersonAttributesSchema = z.array(z.object({}).passthrough());
export const PetsSchema = z.array(z.object({}).passthrough());
export const PlotsSchema = z.array(z.object({}).passthrough());
export const ResearchProjectsSchema = z.array(z.object({}).passthrough());
export const SkillsSchema = z.array(z.object({}).passthrough());
export const TileTypesSchema = z.array(z.object({}).passthrough());
