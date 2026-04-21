import type { ScheduleEntryKind, TripScheduleEntry } from './types';

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
