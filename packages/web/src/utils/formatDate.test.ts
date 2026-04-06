import { formatGameDate } from './formatDate';

describe('formatGameDate', () => {
  it('formats day 0 as DAY 1', () => {
    expect(formatGameDate(0)).toBe('DAY 1 — 1 JANUARY, YEAR 1');
  });

  it('formats day 30 correctly', () => {
    expect(formatGameDate(30)).toBe('DAY 31 — 31 JANUARY, YEAR 1');
  });

  it('formats day 31 (February 1)', () => {
    expect(formatGameDate(31)).toBe('DAY 32 — 1 FEBRUARY, YEAR 1');
  });

  it('advances to year 2 after 365 days', () => {
    const result = formatGameDate(365);
    expect(result).toContain('YEAR 2');
  });
});
