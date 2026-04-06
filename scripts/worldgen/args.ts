import type { WorldGenParams } from '../../packages/engine/src/types/index.js';

/** Parse --key=value and --key value flags from process.argv */
export function parseArgs(argv: string[]): Partial<WorldGenParams> {
  const args = argv.slice(2);
  const flags: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (arg.startsWith('--')) {
      const eqIdx = arg.indexOf('=');
      if (eqIdx !== -1) {
        flags[arg.slice(2, eqIdx)] = arg.slice(eqIdx + 1);
      } else {
        const next = args[i + 1];
        if (next && !next.startsWith('--')) {
          flags[arg.slice(2)] = next;
          i++;
        } else {
          flags[arg.slice(2)] = 'true';
        }
      }
    }
  }

  const result: Partial<WorldGenParams> = {};

  if (flags['seed']) result.seed = Number(flags['seed']);
  if (flags['width']) result.mapWidth = Number(flags['width']);
  if (flags['height']) result.mapHeight = Number(flags['height']);
  if (flags['nations']) result.nationCount = Number(flags['nations']);
  if (flags['zones-per-nation']) result.zonesPerNation = Number(flags['zones-per-nation']);
  if (flags['density']) result.populationDensity = Number(flags['density']);
  if (flags['max-buildings']) result.maxBuildingsPerZone = Number(flags['max-buildings']);
  if (flags['min-zone-size']) result.minZoneSize = Number(flags['min-zone-size']);
  if (flags['max-zone-size']) result.maxZoneSize = Number(flags['max-zone-size']);
  if (flags['noise-scale'] || flags['wealth-floor']) {
    result.terrainProfile = {
      noiseScale: flags['noise-scale'] ? Number(flags['noise-scale']) : 4.0,
      uninhabitedWealthFloor: flags['wealth-floor'] ? Number(flags['wealth-floor']) : 20,
    };
  }

  return result;
}
