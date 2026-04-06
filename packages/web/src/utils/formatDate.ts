const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function formatGameDate(dayIndex: number): string {
  const displayDay = dayIndex + 1;
  let remaining = dayIndex;
  let year = 1;

  while (remaining >= 365) {
    remaining -= 365;
    year++;
  }

  let monthIndex = 0;
  while (monthIndex < 11 && remaining >= DAYS_IN_MONTH[monthIndex]) {
    remaining -= DAYS_IN_MONTH[monthIndex];
    monthIndex++;
  }

  const dayOfMonth = remaining + 1;
  return `DAY ${displayDay} — ${dayOfMonth} ${MONTHS[monthIndex]}, YEAR ${year}`;
}
