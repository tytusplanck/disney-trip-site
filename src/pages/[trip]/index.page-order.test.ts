import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(join(process.cwd(), 'src/pages/[trip]/index.astro'), 'utf-8');

describe('trip root redirect', () => {
  it('redirects the base trip path to the first planner section', () => {
    expect(
      source.includes('import { findTripDataModule, findTripSummary, getTripLandingPath }'),
    ).toBe(true);
    expect(source.includes("const tripSlug = Astro.params['trip'] ?? '';")).toBe(true);
    expect(source.includes('const trip = findTripSummary(allTripsData.trips, tripSlug);')).toBe(
      true,
    );
    expect(source.includes('const tripLandingPath = getTripLandingPath(trip, tripModule);')).toBe(
      true,
    );
    expect(source.includes("if (tripLandingPath === '')")).toBe(true);
    expect(source.includes('return Astro.redirect(tripLandingPath);')).toBe(true);
    expect(source.includes('TripPageShell')).toBe(false);
  });
});
