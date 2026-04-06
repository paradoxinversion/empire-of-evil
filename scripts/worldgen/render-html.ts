import type { GameState } from '../../packages/engine/src/types/index.js';
import type { Config } from '../../packages/engine/src/config/loader.js';

const TILE_PX = 6;

const COLOR: Record<string, string> = {
  ocean: '#1a6fa3',
  mountain: '#888888',
  coastal: '#a3c4bc',
  swamp: '#4a7c59',
  tundra: '#b0c4de',
  city: '#e8d5a3',
  forest: '#2d6a2d',
  plains: '#90c070',
  desert: '#d4a830',
  wilderness: '#5a4a3a',
};

/** Render a self-contained HTML color map. */
export function renderHtml(state: GameState, config: Config, width: number, height: number): string {
  // Build typeId and zoneId grids
  const typeGrid: string[][] = Array.from({ length: height }, () => new Array(width).fill(''));
  const zoneGrid: string[][] = Array.from({ length: height }, () => new Array(width).fill(''));

  for (const tile of Object.values(state.tiles)) {
    const match = tile.id.match(/^(?:ocean-|tile-)(\d+)-(\d+)$/);
    if (!match) continue;
    const x = Number(match[1]);
    const y = Number(match[2]);
    if (x < width && y < height) {
      typeGrid[y]![x] = tile.typeId;
      zoneGrid[y]![x] = tile.zoneId;
    }
  }

  // CSS for tile types
  const tileStyles = Object.entries(COLOR)
    .map(([id, color]) => `.t-${id} { background: ${color}; }`)
    .join('\n');

  // Build grid rows
  const rows = typeGrid.map((row, y) =>
    `<div class="row">${row.map((typeId, x) => {
      const zoneId = zoneGrid[y]![x] ?? '';
      const rightZone = zoneGrid[y]?.[x + 1] ?? '';
      const bottomZone = zoneGrid[y + 1]?.[x] ?? '';
      const borderRight = zoneId && rightZone && zoneId !== rightZone ? 'border-right:1px solid rgba(0,0,0,0.4);' : '';
      const borderBottom = zoneId && bottomZone && zoneId !== bottomZone ? 'border-bottom:1px solid rgba(0,0,0,0.4);' : '';
      const style = borderRight || borderBottom ? ` style="${borderRight}${borderBottom}"` : '';
      return `<div class="tile t-${typeId || 'ocean'}"${style}></div>`;
    }).join('')}</div>`,
  ).join('\n');

  // Legend
  const legend = Object.entries(COLOR)
    .filter(([id]) => config.tileTypes[id])
    .map(([id, color]) =>
      `<div class="legend-item"><div class="swatch" style="background:${color}"></div><span>${config.tileTypes[id]?.name ?? id}</span></div>`,
    ).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>World Map</title>
<style>
body { font-family: monospace; background: #111; color: #eee; padding: 16px; }
.map { display: inline-block; line-height: 0; }
.row { display: flex; }
.tile { width: ${TILE_PX}px; height: ${TILE_PX}px; box-sizing: border-box; }
${tileStyles}
.legend { margin-top: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.legend-item { display: flex; align-items: center; gap: 4px; font-size: 12px; }
.swatch { width: 14px; height: 14px; border: 1px solid #555; }
h2 { margin: 0 0 8px; font-size: 14px; color: #aaa; }
</style>
</head>
<body>
<h2>World Map — ${width}×${height}</h2>
<div class="map">
${rows}
</div>
<div class="legend">${legend}</div>
</body>
</html>`;
}
