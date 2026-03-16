import type {
  LLMemberPlan,
  LLParkDay,
  LLParkDaySelections,
  LLParkId,
  LLParkInventory,
  LLPlannerData,
} from './ll-types';
import type { TripDataModule } from './types';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

const PARK_LABEL_TO_ID: Record<string, LLParkId> = {
  'Magic Kingdom': 'magic-kingdom',
  EPCOT: 'epcot',
  "Disney's Hollywood Studios": 'hollywood-studios',
  "Disney's Animal Kingdom": 'animal-kingdom',
};

export function buildLLPlannerData(module: TripDataModule): LLPlannerData {
  if (!module.llInventory || !module.llDefaultPlan) {
    throw new Error('LL data is required to build planner data');
  }

  const inventory = module.llInventory;
  const defaultPlan = module.llDefaultPlan;
  const firstEntry = module.schedule[0];
  if (!firstEntry) throw new Error('Schedule is empty');
  const tripStart = new Date(firstEntry.date + 'T12:00:00');

  const parkDays: LLParkDay[] = module.schedule
    .filter(
      (entry): entry is typeof entry & { parkLabel: string } =>
        entry.kind === 'park' && entry.parkLabel != null,
    )
    .map((entry) => {
      const d = new Date(entry.date + 'T12:00:00');
      const dayNumber = Math.round((d.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const parkId = PARK_LABEL_TO_ID[entry.parkLabel] ?? 'magic-kingdom';
      const monthLabel = MONTHS[d.getMonth()] ?? '';
      const weekdayLabel = WEEKDAYS[d.getDay()] ?? '';

      return {
        parkDate: entry.date,
        parkId,
        parkLabel: entry.parkLabel,
        dayNumber,
        weekdayLabel,
        dateLabel: `${monthLabel} ${String(d.getDate())}`,
        scheduleNotes: entry.notes,
      };
    });

  return {
    party: module.party,
    parkDays,
    inventory: inventory as Record<LLParkId, LLParkInventory>,
    defaultPlan,
    ownerMemberId: defaultPlan.memberId,
  };
}

export function emptySelections(): LLParkDaySelections {
  return {
    illSelections: [],
    tier1Selection: null,
    tier2Selections: [],
    multiPassSelections: [],
  };
}

export function toggleSelection(
  current: LLParkDaySelections,
  attractionId: string,
  inventory: LLParkInventory,
): LLParkDaySelections {
  const attraction = inventory.attractions.find((a) => a.id === attractionId);
  if (!attraction || attraction.closedDuringTrip) return current;

  if (attraction.passType === 'individual') {
    return toggleILL(current, attractionId);
  }

  if (inventory.hasTiers) {
    if (attraction.tier === 'tier1') {
      return toggleTier1(current, attractionId);
    }
    if (attraction.tier === 'tier2') {
      return toggleTier2(current, attractionId, inventory.maxTier2);
    }
  } else {
    return toggleMultiPass(current, attractionId, inventory.maxMultiPass);
  }

  return current;
}

function toggleILL(current: LLParkDaySelections, id: string): LLParkDaySelections {
  const has = current.illSelections.includes(id);
  return {
    ...current,
    illSelections: has
      ? current.illSelections.filter((s) => s !== id)
      : [...current.illSelections, id],
  };
}

function toggleTier1(current: LLParkDaySelections, id: string): LLParkDaySelections {
  return {
    ...current,
    tier1Selection: current.tier1Selection === id ? null : id,
  };
}

function toggleTier2(current: LLParkDaySelections, id: string, max: number): LLParkDaySelections {
  const has = current.tier2Selections.includes(id);
  if (has) {
    return {
      ...current,
      tier2Selections: current.tier2Selections.filter((s) => s !== id),
    };
  }
  if (current.tier2Selections.length >= max) return current;
  return {
    ...current,
    tier2Selections: [...current.tier2Selections, id],
  };
}

function toggleMultiPass(
  current: LLParkDaySelections,
  id: string,
  max: number,
): LLParkDaySelections {
  const has = current.multiPassSelections.includes(id);
  if (has) {
    return {
      ...current,
      multiPassSelections: current.multiPassSelections.filter((s) => s !== id),
    };
  }
  if (current.multiPassSelections.length >= max) return current;
  return {
    ...current,
    multiPassSelections: [...current.multiPassSelections, id],
  };
}

export function getMultiPassCount(
  selections: LLParkDaySelections,
  inventory: LLParkInventory,
): number {
  if (inventory.hasTiers) {
    return (selections.tier1Selection != null ? 1 : 0) + selections.tier2Selections.length;
  }
  return selections.multiPassSelections.length;
}

// URL serialization
function buildShortCodeMap(inventory: Record<LLParkId, LLParkInventory>): {
  byId: Map<string, string>;
  byCode: Map<string, string>;
} {
  const byId = new Map<string, string>();
  const byCode = new Map<string, string>();
  for (const park of Object.values(inventory)) {
    for (const a of park.attractions) {
      byId.set(a.id, a.shortCode);
      byCode.set(a.shortCode, a.id);
    }
  }
  return { byId, byCode };
}

function serializeDaySelections(
  selections: LLParkDaySelections,
  parkInventory: LLParkInventory,
  idToCode: Map<string, string>,
): string {
  const parts: string[] = [];

  // ILL
  if (selections.illSelections.length > 0) {
    const codes = selections.illSelections.map((id) => idToCode.get(id) ?? id);
    parts.push('i.' + codes.join('.'));
  }

  if (parkInventory.hasTiers) {
    // Tier 1
    if (selections.tier1Selection) {
      parts.push('t1.' + (idToCode.get(selections.tier1Selection) ?? selections.tier1Selection));
    }
    // Tier 2
    if (selections.tier2Selections.length > 0) {
      const codes = selections.tier2Selections.map((id) => idToCode.get(id) ?? id);
      parts.push('t2.' + codes.join('.'));
    }
  } else {
    // Multi Pass (non-tiered)
    if (selections.multiPassSelections.length > 0) {
      const codes = selections.multiPassSelections.map((id) => idToCode.get(id) ?? id);
      parts.push('m.' + codes.join('.'));
    }
  }

  return parts.join('.');
}

export function serializePlan(
  plan: LLMemberPlan,
  inventory: Record<LLParkId, LLParkInventory>,
  parkDays: LLParkDay[],
): string {
  const { byId } = buildShortCodeMap(inventory);
  const dayParts: string[] = [];

  for (const day of parkDays) {
    const selections = plan.parkDays[day.parkDate];
    if (!selections) continue;

    const parkInv = inventory[day.parkId];
    const dateCode = day.parkDate.slice(5).replace('-', '');
    const encoded = serializeDaySelections(selections, parkInv, byId);
    if (encoded.length > 0) {
      dayParts.push(`${dateCode}=${encoded}`);
    }
  }

  if (dayParts.length === 0) return '';
  return `ll=${plan.memberId}:${dayParts.join(',')}`;
}

export function deserializePlan(
  hash: string,
  inventory: Record<LLParkId, LLParkInventory>,
  parkDays: LLParkDay[],
): { memberId: string; plan: LLMemberPlan } | null {
  const cleaned = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!cleaned.startsWith('ll=')) return null;

  const payload = cleaned.slice(3);
  const colonIdx = payload.indexOf(':');
  if (colonIdx < 0) return null;

  const memberId = payload.slice(0, colonIdx);
  const daysStr = payload.slice(colonIdx + 1);
  const { byCode } = buildShortCodeMap(inventory);

  const parkDayMap = new Map<string, LLParkDay>();
  for (const day of parkDays) {
    const dateCode = day.parkDate.slice(5).replace('-', '');
    parkDayMap.set(dateCode, day);
  }

  const parkDaySelections: Record<string, LLParkDaySelections> = {};

  // Initialize all park days with empty selections
  for (const day of parkDays) {
    parkDaySelections[day.parkDate] = emptySelections();
  }

  const daySegments = daysStr.split(',');
  for (const segment of daySegments) {
    const eqIdx = segment.indexOf('=');
    if (eqIdx < 0) continue;

    const dateCode = segment.slice(0, eqIdx);
    const encoded = segment.slice(eqIdx + 1);
    const day = parkDayMap.get(dateCode);
    if (!day) continue;

    const parkInv = inventory[day.parkId];
    const sel = parseDaySelections(encoded, parkInv, byCode);
    parkDaySelections[day.parkDate] = sel;
  }

  return {
    memberId,
    plan: { memberId, parkDays: parkDaySelections },
  };
}

function parseDaySelections(
  encoded: string,
  _parkInventory: LLParkInventory,
  codeToId: Map<string, string>,
): LLParkDaySelections {
  const result = emptySelections();
  const tokens = encoded.split('.');

  let mode: 'none' | 'i' | 't1' | 't2' | 'm' = 'none';

  for (const token of tokens) {
    if (token === 'i') {
      mode = 'i';
      continue;
    }
    if (token === 't1') {
      mode = 't1';
      continue;
    }
    if (token === 't2') {
      mode = 't2';
      continue;
    }
    if (token === 'm') {
      mode = 'm';
      continue;
    }

    const attractionId = codeToId.get(token);
    if (!attractionId) continue;

    switch (mode) {
      case 'i':
        result.illSelections.push(attractionId);
        break;
      case 't1':
        result.tier1Selection = attractionId;
        break;
      case 't2':
        result.tier2Selections.push(attractionId);
        break;
      case 'm':
        result.multiPassSelections.push(attractionId);
        break;
    }
  }

  return result;
}
