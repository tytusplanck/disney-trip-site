import { describe, expect, it } from 'vitest';
import { getPrintDocumentTitle } from './print';

const copy = { buttonLabel: 'Print / Save PDF', documentTitle: 'Packing list' };

describe('print document title', () => {
  it('names the saved PDF after the trip and the printed page', () => {
    expect(getPrintDocumentTitle('Planck Mega Trip', copy)).toBe('Planck Mega Trip – Packing list');
  });

  it('adds the on-screen filter so differently filtered PDFs get distinct names', () => {
    expect(
      getPrintDocumentTitle('Planck Mega Trip', copy, 'Adults with kids · Must pack only'),
    ).toBe('Planck Mega Trip – Packing list (Adults with kids · Must pack only)');
    expect(getPrintDocumentTitle('Planck Mega Trip', copy, '')).toBe(
      'Planck Mega Trip – Packing list',
    );
  });
});
