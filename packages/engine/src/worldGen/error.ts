export type WorldGenErrorCode =
  | 'INSUFFICIENT_HABITABLE_ZONES'
  | 'INSUFFICIENT_CONTIGUOUS_ZONES'
  | 'ZONE_SIZE_INVALID'
  | 'ZONES_PER_NATION_TOO_SMALL';

export class WorldGenError extends Error {
  constructor(
    public readonly code: WorldGenErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'WorldGenError';
  }
}
