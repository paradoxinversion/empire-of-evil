import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Tile, Zone, Nation } from '@empire-of-evil/engine';
import {
  buildPoliticalColorMap,
  buildIntelColorMap,
  parseTileCoords,
  deriveMapBounds,
  TILE_TYPE_ICONS,
  TILE_TYPE_NAMES,
} from '../../utils/mapUtils';

interface TileMapProps {
  tiles: Record<string, Tile>;
  zones: Record<string, Zone>;
  nations: Record<string, Nation>;
  empireId: string;
  layer: 'political' | 'intel';
  selectedZoneId: string | null;
  onZoneClick: (zoneId: string | null) => void;
}

const BASE_TILE_SIZE = 6;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 8.0;

export function TileMap({
  tiles,
  zones,
  nations,
  empireId,
  layer,
  selectedZoneId,
  onZoneClick,
}: TileMapProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomRef = useRef(1.0);
  const panRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const colorMapRef = useRef<Record<string, string>>({});
  const selectedZoneIdRef = useRef<string | null>(selectedZoneId);
  const tilesRef = useRef(tiles);
  const zonesRef = useRef(zones);
  const mapBoundsRef = useRef(deriveMapBounds(tiles));
  const [showOverlay, setShowOverlay] = useState(false);
  const showOverlayRef = useRef(false);

  // Keep refs in sync with props/state
  selectedZoneIdRef.current = selectedZoneId;
  tilesRef.current = tiles;
  zonesRef.current = zones;
  showOverlayRef.current = showOverlay;

  const tileColorMap = useMemo(() => {
    return layer === 'political'
      ? buildPoliticalColorMap(tiles, zones, nations, empireId)
      : buildIntelColorMap(tiles, zones);
  }, [tiles, zones, nations, empireId, layer]);

  // Update color map ref and map bounds whenever they change
  colorMapRef.current = tileColorMap;
  mapBoundsRef.current = deriveMapBounds(tiles);

  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const zoom = zoomRef.current;
    const pan = panRef.current;
    const tileSize = BASE_TILE_SIZE * zoom;
    const colorMap = colorMapRef.current;
    const { width: mapWidth, height: mapHeight } = mapBoundsRef.current;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0b1a2e';
    ctx.fillRect(0, 0, W, H);

    if (mapWidth === 0 || mapHeight === 0) return;

    const xStart = Math.max(0, Math.floor(-pan.x / tileSize));
    const xEnd = Math.min(mapWidth - 1, Math.ceil((-pan.x + W) / tileSize));
    const yStart = Math.max(0, Math.floor(-pan.y / tileSize));
    const yEnd = Math.min(mapHeight - 1, Math.ceil((-pan.y + H) / tileSize));

    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        const color =
          colorMap[`tile-${x}-${y}`] ??
          colorMap[`ocean-${x}-${y}`] ??
          '#0f2a47';
        ctx.fillStyle = color;
        ctx.fillRect(
          Math.floor(pan.x + x * tileSize),
          Math.floor(pan.y + y * tileSize),
          Math.ceil(tileSize),
          Math.ceil(tileSize),
        );
      }
    }

    const selZoneId = selectedZoneIdRef.current;
    if (selZoneId && zoom >= 1.5) {
      const selZone = zonesRef.current[selZoneId];
      if (selZone) {
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 1 / zoom;
        for (const tileId of selZone.tileIds) {
          const coords = parseTileCoords(tileId);
          if (!coords) continue;
          ctx.strokeRect(
            pan.x + coords.x * tileSize,
            pan.y + coords.y * tileSize,
            tileSize,
            tileSize,
          );
        }
      }
    }

    if (showOverlayRef.current) {
      for (let y = yStart; y <= yEnd; y++) {
        for (let x = xStart; x <= xEnd; x++) {
          if (tileSize < 5) continue;
          const tile =
            tilesRef.current[`tile-${x}-${y}`] ??
            tilesRef.current[`ocean-${x}-${y}`];
          if (!tile) continue;
          const icon = TILE_TYPE_ICONS[tile.typeId];
          if (!icon) continue;
          const fontSize = Math.max(4, Math.floor(tileSize * 0.7));
          ctx.font = `${fontSize}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const cx = Math.floor(pan.x + x * tileSize + tileSize / 2);
          const cy = Math.floor(pan.y + y * tileSize + tileSize / 2);
          ctx.fillStyle = 'rgba(0,0,0,0.55)';
          ctx.fillText(icon, cx + 1, cy + 1);
          ctx.fillStyle = 'rgba(220,210,180,0.90)';
          ctx.fillText(icon, cx, cy);
        }
      }
    }
  }, []);

  // Redraw when color map or selected zone changes
  useEffect(() => {
    drawMap();
  }, [tileColorMap, selectedZoneId, drawMap]);

  // ResizeObserver — also handles initial draw
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      canvas.width = entry.contentRect.width;
      canvas.height = entry.contentRect.height;
      drawMap();
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [drawMap]);

  // Mouse event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const oldZoom = zoomRef.current;
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, oldZoom * (1 - e.deltaY * 0.001)));
      const scale = newZoom / oldZoom;
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;
      panRef.current = {
        x: mouseX - (mouseX - panRef.current.x) * scale,
        y: mouseY - (mouseY - panRef.current.y) * scale,
      };
      zoomRef.current = newZoom;
      drawMap();
    };

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: panRef.current.x,
        panY: panRef.current.y,
      };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !dragStartRef.current) return;
      panRef.current = {
        x: dragStartRef.current.panX + (e.clientX - dragStartRef.current.x),
        y: dragStartRef.current.panY + (e.clientY - dragStartRef.current.y),
      };
      drawMap();
    };

    const onMouseUp = (e: MouseEvent) => {
      const wasDragging = isDraggingRef.current;
      const start = dragStartRef.current;
      isDraggingRef.current = false;

      if (!wasDragging || !start) return;

      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 4) {
        // Treat as click
        const tileSize = BASE_TILE_SIZE * zoomRef.current;
        const tx = Math.floor((e.offsetX - panRef.current.x) / tileSize);
        const ty = Math.floor((e.offsetY - panRef.current.y) / tileSize);
        const tileKey = `tile-${tx}-${ty}`;
        const oceanKey = `ocean-${tx}-${ty}`;
        const tile = tilesRef.current[tileKey] ?? tilesRef.current[oceanKey];
        if (tile && tile.zoneId !== '') {
          onZoneClick(tile.zoneId);
        } else {
          onZoneClick(null);
        }
      }
    };

    const onMouseLeave = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseLeave);

    return () => {
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [drawMap, onZoneClick]);

  return (
    <div
      ref={wrapperRef}
      style={{ height: '600px' }}
      className="relative w-full overflow-hidden bg-[#0b1a2e] rounded-sm border border-border-subtle cursor-crosshair"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <button
        type="button"
        onClick={() => {
          showOverlayRef.current = !showOverlayRef.current;
          setShowOverlay(showOverlayRef.current);
          drawMap();
        }}
        className={[
          'absolute top-2 right-2 z-10 font-mono text-[10px] tracking-[0.08em] px-2.5 py-1',
          'border cursor-pointer transition-colors',
          showOverlay
            ? 'text-text-primary border-accent-red'
            : 'text-text-muted border-border-subtle hover:text-text-secondary',
        ].join(' ')}
      >
        TERRAIN
      </button>
      {showOverlay && (
        <div
          className="absolute bottom-2 left-2 z-10 font-mono text-[10px] text-text-secondary"
          style={{
            background: 'rgba(13,15,17,0.88)',
            border: '1px solid #1f2530',
            padding: '6px 8px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              columnGap: '12px',
              rowGap: '2px',
            }}
          >
            {Object.entries(TILE_TYPE_ICONS).map(([typeId, icon]) => (
              <div key={typeId} style={{ display: 'flex', gap: '5px' }}>
                <span style={{ color: 'rgba(220,210,180,0.90)', minWidth: '10px', textAlign: 'center' }}>
                  {icon}
                </span>
                <span>{TILE_TYPE_NAMES[typeId] ?? typeId}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
