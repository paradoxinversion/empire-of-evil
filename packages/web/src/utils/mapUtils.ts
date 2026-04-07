import type { Tile, Zone, Nation, TileTypeDefinition } from '@empire-of-evil/engine';
import tileTypesJson from '../../../../config/default/tileTypes.json';

const _tileTypes = tileTypesJson as Record<string, TileTypeDefinition>;

export const TILE_TYPE_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(_tileTypes).map(([id, def]) => [id, def.name])
);

export const TILE_TYPE_ICONS: Record<string, string> = Object.fromEntries(
  Object.entries(_tileTypes).map(([id, def]) => [id, def.icon])
);

export function parseTileCoords(id: string): { x: number; y: number } | null {
  let rest: string;
  if (id.startsWith('tile-')) {
    rest = id.slice(5);
  } else if (id.startsWith('ocean-')) {
    rest = id.slice(6);
  } else {
    return null;
  }
  const dashIdx = rest.indexOf('-');
  if (dashIdx === -1) return null;
  const x = parseInt(rest.slice(0, dashIdx), 10);
  const y = parseInt(rest.slice(dashIdx + 1), 10);
  if (isNaN(x) || isNaN(y)) return null;
  return { x, y };
}

export function deriveMapBounds(tiles: Record<string, Tile>): { width: number; height: number } {
  let maxX = -1;
  let maxY = -1;
  for (const id of Object.keys(tiles)) {
    const coords = parseTileCoords(id);
    if (!coords) continue;
    if (coords.x > maxX) maxX = coords.x;
    if (coords.y > maxY) maxY = coords.y;
  }
  if (maxX < 0) return { width: 0, height: 0 };
  return { width: maxX + 1, height: maxY + 1 };
}

const NATION_PALETTE = [
  '#4a6fa5', '#5a8f5a', '#c47a3a', '#8a4a8a', '#3a8a8a',
  '#7a7a3a', '#3a4a8a', '#8a5a3a', '#5a3a8a', '#3a7a5a',
];

export function buildPoliticalColorMap(
  tiles: Record<string, Tile>,
  zones: Record<string, Zone>,
  nations: Record<string, Nation>,
  empireId: string,
): Record<string, string> {
  const sortedNationIds = Object.keys(nations).sort();
  const nationColor = new Map<string, string>();
  sortedNationIds.forEach((id, i) => {
    nationColor.set(id, NATION_PALETTE[i % NATION_PALETTE.length]!);
  });

  const colorMap: Record<string, string> = {};
  for (const [id, tile] of Object.entries(tiles)) {
    if (tile.zoneId === '') {
      colorMap[id] = '#0f2a47';
      continue;
    }
    const zone = zones[tile.zoneId];
    if (!zone) {
      colorMap[id] = '#0f2a47';
      continue;
    }
    if (zone.governingOrganizationId === empireId) {
      colorMap[id] = '#c43030';
    } else {
      colorMap[id] = nationColor.get(zone.nationId) ?? '#4a5568';
    }
  }
  return colorMap;
}

function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ] as [number, number, number];
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const b2 = Math.round(ab + (bb - ab) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b2.toString(16).padStart(2, '0')}`;
}

export function buildIntelColorMap(
  tiles: Record<string, Tile>,
  zones: Record<string, Zone>,
): Record<string, string> {
  const colorMap: Record<string, string> = {};
  for (const [id, tile] of Object.entries(tiles)) {
    if (tile.zoneId === '') {
      colorMap[id] = '#0f2a47';
      continue;
    }
    const zone = zones[tile.zoneId];
    if (!zone) {
      colorMap[id] = '#0f2a47';
      continue;
    }
    colorMap[id] = lerpColor('#1a2a3a', '#00c870', zone.intelLevel / 100);
  }
  return colorMap;
}
