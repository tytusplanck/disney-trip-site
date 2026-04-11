import { describe, expect, it } from 'vitest';
import { planckMegaDisneyTripLogistics } from './logistics';

const logisticsText = JSON.stringify(planckMegaDisneyTripLogistics);
const entriesById = new Map(planckMegaDisneyTripLogistics.map((entry) => [entry.id, entry]));

describe('Planck Mega Disney Trip logistics', () => {
  it('keeps the current lodging and airport transportation plan', () => {
    expect(entriesById.get('wilderness-lodge-home-base')).toMatchObject({
      kind: 'resort',
      title: "Home base: Boulder Ridge Villas at Disney's Wilderness Lodge",
    });
    expect(entriesById.get('wilderness-lodge-home-base')?.notes).toContain('Copper Creek');
    expect(entriesById.get('airport-transportation')?.notes).toContain('Mears');
  });

  it('uses first names only when describing people', () => {
    expect(entriesById.get('wilderness-lodge-home-base')?.notes).toContain('Barb, David, and Lee');
    expect(logisticsText).not.toMatch(/Barb Ford|David Everett|Lee Bastyr/i);
  });

  it('breaks down Disney transportation to each park', () => {
    expect(entriesById.get('transport-magic-kingdom')?.notes).toContain('boat');
    expect(entriesById.get('transport-animal-kingdom')?.notes).toContain('bus');
    expect(entriesById.get('transport-epcot')?.notes).toContain('bus');
    expect(entriesById.get('transport-hollywood-studios')?.notes).toContain('bus');
  });

  it('removes outdated dining, app, ticket, and reservation callouts', () => {
    expect(logisticsText).not.toMatch(/Chef Mickey/i);
    expect(logisticsText).not.toMatch(/My Disney Experience app/i);
    expect(logisticsText).not.toMatch(/Park tickets/i);
    expect(logisticsText).not.toMatch(/reservations/i);
  });

  it('keeps dated arrival, resort day, and departure narratives out of logistics', () => {
    expect(entriesById.has('arrival-day')).toBe(false);
    expect(entriesById.has('resort-day-nov-9')).toBe(false);
    expect(entriesById.has('resort-day-nov-11')).toBe(false);
    expect(entriesById.has('group-departure-nov-13')).toBe(false);
    expect(logisticsText).not.toMatch(/arrival day|resort day|arrive today|leave today/i);
  });
});
