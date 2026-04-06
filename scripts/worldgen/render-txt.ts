import type { GameState } from '../../packages/engine/src/types/index.js';
import type { Config } from '../../packages/engine/src/config/loader.js';

const TYPE_CHAR: Record<string, string> = {
  ocean: '~',
  mountain: '^',
  coastal: 'c',
  swamp: '%',
  tundra: '_',
  city: 'C',
  forest: 'f',
  plains: '.',
  desert: ':',
  wilderness: 'w',
};

/** Render a plain-text ASCII terrain map. One character per tile. */
export function renderTxt(state: GameState, config: Config, width: number, height: number): string {
  const grid: string[][] = Array.from({ length: height }, () => new Array(width).fill('?'));

  for (const tile of Object.values(state.tiles)) {
    const match = tile.id.match(/^(?:ocean-|tile-)(\d+)-(\d+)$/);
    if (!match) continue;
    const x = Number(match[1]);
    const y = Number(match[2]);
    if (x < width && y < height) {
      grid[y]![x] = TYPE_CHAR[tile.typeId] ?? '?';
    }
  }

  // Draw zone boundaries: mark zone transitions with uppercase where possible
  // (simple approach: just draw the terrain chars)
  const legend = Object.entries(TYPE_CHAR)
    .map(([id, ch]) => `${ch}=${config.tileTypes[id]?.name ?? id}`)
    .join('  ');

  return grid.map(row => row.join('')).join('\n') + '\n\nLegend: ' + legend + '\n';
}
