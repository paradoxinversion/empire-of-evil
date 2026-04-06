// Internal types used during world generation. Not part of GameState.

export interface GridCell {
  x: number;
  y: number;
  typeId: string;
  elevation: number;
  moisture: number;
}

export interface ZoneCandidate {
  id: string;
  tileIds: string[];
  pluralityTypeId: string;
  generationWealth: number;
  /** Flat tile coords (index = y * mapWidth + x) for adjacency lookups */
  tileCells: Array<{ x: number; y: number }>;
}
