#!/usr/bin/env tsx
/**
 * World Generation CLI Script
 *
 * Usage:
 *   pnpm worldgen
 *   pnpm worldgen --seed=42 --width=50 --height=50 --nations=3
 *
 * Outputs to: output/worldgen-<seed>-<timestamp>/
 *   world.json  — serialized GameState
 *   map.txt     — ASCII terrain map
 *   map.html    — color-coded visual map
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig } from '../packages/engine/src/config/loader.js';
import { generateWorld, WorldGenError } from '../packages/engine/src/worldGen/index.js';
import type { WorldGenParams } from '../packages/engine/src/types/index.js';
import { parseArgs } from './worldgen/args.js';
import { renderTxt } from './worldgen/render-txt.js';
import { renderHtml } from './worldgen/render-html.js';
import { printSummary } from './worldgen/summary.js';

const repoRoot = join(fileURLToPath(import.meta.url), '../..');
const configDir = join(repoRoot, 'config', 'default');

// Load config
const config = loadConfig(configDir);

// Merge config defaults with CLI overrides
const cliOverrides = parseArgs(process.argv);

const params: WorldGenParams = {
  seed: cliOverrides.seed,
  mapWidth: cliOverrides.mapWidth ?? config.worldgen.mapWidth,
  mapHeight: cliOverrides.mapHeight ?? config.worldgen.mapHeight,
  minZoneSize: cliOverrides.minZoneSize ?? config.worldgen.minZoneSize,
  maxZoneSize: cliOverrides.maxZoneSize ?? config.worldgen.maxZoneSize,
  nationCount: cliOverrides.nationCount ?? config.worldgen.nationCount,
  zonesPerNation: cliOverrides.zonesPerNation ?? config.worldgen.zonesPerNation,
  populationDensity: cliOverrides.populationDensity ?? config.worldgen.populationDensity,
  maxBuildingsPerZone: cliOverrides.maxBuildingsPerZone ?? config.worldgen.maxBuildingsPerZone,
  terrainProfile: cliOverrides.terrainProfile ?? config.worldgen.terrainProfile,
};

console.log('Generating world...');

let state;
try {
  state = generateWorld(params, config);
} catch (e) {
  if (e instanceof WorldGenError) {
    console.error(`\nWorld generation failed [${e.code}]: ${e.message}`);
    process.exit(1);
  }
  throw e;
}

// Create output directory
const outputDir = join(repoRoot, 'output', `worldgen-${state.worldSeed}-${Date.now()}`);
mkdirSync(outputDir, { recursive: true });

// Write outputs
writeFileSync(join(outputDir, 'world.json'), JSON.stringify(state, null, 2));
writeFileSync(join(outputDir, 'map.txt'), renderTxt(state, config, params.mapWidth, params.mapHeight));
writeFileSync(join(outputDir, 'map.html'), renderHtml(state, config, params.mapWidth, params.mapHeight));

printSummary(state, params, outputDir);
