export type AttractionTone = 'high' | 'medium' | 'low';

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

export function getDayLabels(isoDate: string): { weekdayLabel: string; dateLabel: string } {
  const date = new Date(`${isoDate}T12:00:00`);

  return {
    weekdayLabel: WEEKDAY_FORMATTER.format(date),
    dateLabel: DATE_FORMATTER.format(date),
  };
}

export function getAttractionTone(scorePercent: number): AttractionTone {
  if (scorePercent >= 74) {
    return 'high';
  }

  if (scorePercent >= 58) {
    return 'medium';
  }

  return 'low';
}
