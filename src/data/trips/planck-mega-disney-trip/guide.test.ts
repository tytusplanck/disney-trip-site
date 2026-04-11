import { describe, expect, it } from 'vitest';
import { planckMegaDisneyTripGuide } from './guide';

const priorityByAttractionId = new Map(
  planckMegaDisneyTripGuide.map((attraction) => [attraction.id, attraction.priority]),
);

describe('Planck Mega Disney Trip guide attractions', () => {
  it('matches the current family attraction priorities', () => {
    expect(Object.fromEntries(priorityByAttractionId)).toMatchObject({
      'buzz-lightyear-s-space-ranger-spin': 'if-time',
      'expedition-everest': 'recommended',
      'frozen-ever-after': 'must-do',
      'happily-ever-after': 'must-do',
      'it-s-a-small-world': 'must-do',
      'jungle-cruise': 'recommended',
      'living-with-the-land': 'recommended',
      'peter-pan-s-flight': 'recommended',
      'remy-ratatouille': 'must-do',
      'soarin-around-the-world': 'recommended',
      'space-mountain': 'if-time',
      'the-many-adventures-of-winnie-the-pooh': 'must-do',
      'tiana-s-bayou-adventure': 'must-do',
      'tomorrowland-transit-authority-peoplemover': 'if-time',
    });
  });

  it('keeps Rock n Roller Coaster aligned with the Muppets update', () => {
    const attraction = planckMegaDisneyTripGuide.find(
      (guideAttraction) => guideAttraction.id === 'rock-n-roller-coaster',
    );

    expect(attraction).toMatchObject({
      attractionLabel: "Rock 'n' Roller Coaster Starring The Muppets",
      priority: 'recommended',
    });
    expect(attraction?.notes).toContain('Electric Mayhem');
    expect(attraction?.notes).toContain('Summer 2026');
  });
});
