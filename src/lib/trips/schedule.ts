import type {
  ScheduleEntryKind,
  ScheduleMoment,
  ScheduleMomentKind,
  ScheduleMomentStatus,
  TripScheduleEntry,
} from './types';

export interface ScheduleBadge {
  kind: ScheduleEntryKind;
  label: string;
}

export const scheduleKindLabelByValue: Record<ScheduleEntryKind, string> = {
  travel: 'Travel',
  park: 'Park Day',
  resort: 'Resort Reset',
};

export function getScheduleEntryKinds(entry: TripScheduleEntry): ScheduleEntryKind[] {
  return Array.from(new Set([entry.kind, ...(entry.kinds ?? [])]));
}

export function hasScheduleEntryKind(entry: TripScheduleEntry, kind: ScheduleEntryKind): boolean {
  return getScheduleEntryKinds(entry).includes(kind);
}

export function getScheduleEntryBadges(entry: TripScheduleEntry): ScheduleBadge[] {
  return getScheduleEntryKinds(entry).map((kind) => ({
    kind,
    label: scheduleKindLabelByValue[kind],
  }));
}

export interface ScheduleMomentView {
  /** Raw HH:MM for the <time datetime> attribute. */
  datetime: string;
  timeLabel: string;
  kind: ScheduleMomentKind;
  kindLabel: string;
  label: string;
  detail: string | null;
  statusLabel: string | null;
}

export const scheduleMomentKindLabelByValue: Record<ScheduleMomentKind, string> = {
  depart: 'Leave',
  'rope-drop': 'Rope drop',
  dining: 'Dining',
  show: 'Show',
  arrival: 'Arrive',
};

const scheduleMomentStatusLabelByValue: Record<ScheduleMomentStatus, string> = {
  booked: 'Booked',
  penciled: 'Penciled',
};

const MOMENT_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function formatScheduleMomentTime(time: string): string {
  const match = MOMENT_TIME_PATTERN.exec(time);
  const hoursToken = match?.[1];
  const minutes = match?.[2];

  if (!hoursToken || !minutes) {
    throw new Error(`Invalid schedule moment time "${time}". Expected 24-hour HH:MM.`);
  }

  const hours24 = Number(hoursToken);
  const period = hours24 < 12 ? 'AM' : 'PM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return `${String(hours12)}:${minutes} ${period}`;
}

function toScheduleMomentView(moment: ScheduleMoment): ScheduleMomentView {
  return {
    datetime: moment.time,
    timeLabel: formatScheduleMomentTime(moment.time),
    kind: moment.kind,
    kindLabel: scheduleMomentKindLabelByValue[moment.kind],
    label: moment.label,
    detail: moment.detail ?? null,
    statusLabel: moment.status ? scheduleMomentStatusLabelByValue[moment.status] : null,
  };
}

export function getScheduleMomentViews(entry: TripScheduleEntry): ScheduleMomentView[] {
  const moments = entry.moments ?? [];

  return [...moments]
    .sort((left, right) => left.time.localeCompare(right.time))
    .map(toScheduleMomentView);
}
