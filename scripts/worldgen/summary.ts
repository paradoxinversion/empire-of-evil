import type { GameState, WorldGenParams } from '../../packages/engine/src/types/index.js';

/** Print a human-readable world generation summary to stdout. */
export function printSummary(state: GameState, params: WorldGenParams, outputDir: string): void {
  const zones = Object.values(state.zones);
  const habitableZones = zones.filter(z => z.population > 0);
  const totalPop = Object.values(state.persons).length;
  const totalBuildings = Object.values(state.buildings).length;
  const nationCount = Object.keys(state.nations).length;

  const empireZone = zones.find(z =>
    z.buildingIds.some(bid => state.buildings[bid]?.typeId === 'headquarters'),
  );

  console.log('');
  console.log('World Generation Summary');
  console.log('========================');
  console.log(`Seed:         ${state.worldSeed}`);
  console.log(`Map:          ${params.mapWidth} × ${params.mapHeight} (${params.mapWidth * params.mapHeight} tiles)`);
  console.log(`Zones:        ${zones.length} total, ${habitableZones.length} habitable`);
  console.log(`Nations:      ${nationCount} × ${params.zonesPerNation} zones each`);
  if (empireZone) {
    console.log(`Empire zone:  ${empireZone.id} (wealth: ${Math.round(empireZone.generationWealth)})`);
  }
  console.log(`Population:   ${totalPop.toLocaleString()} persons`);
  console.log(`Buildings:    ${totalBuildings} placed`);
  console.log(`Output:       ${outputDir}`);
  console.log('');
}
