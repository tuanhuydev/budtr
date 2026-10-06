import { describe, expect, it } from 'vitest';

import { getQuerySuggestions } from './getQuerySuggestions';

const today = new Date(2026, 9, 1);

describe('getQuerySuggestions', () => {
  it('suggests facet keys while typing a bare word', () => {
    expect(getQuerySuggestions('c', today)).toEqual(['category:']);
    expect(getQuerySuggestions('d', today)).toEqual(['date:']);
    expect(getQuerySuggestions('s', today)).toEqual(['source:']);
    expect(getQuerySuggestions('x', today)).toEqual([]);
  });

  it('keeps the negation prefix', () => {
    expect(getQuerySuggestions('-b', today)).toEqual(['-behavior:']);
  });

  it('suggests enum values after key:', () => {
    expect(getQuerySuggestions('type:', today)).toEqual([
      'type:income',
      'type:expense',
    ]);
    expect(getQuerySuggestions('category:tr', today)).toEqual([
      'category:transportation',
      'category:travel',
    ]);
  });

  it('completes the last comma-separated value and skips used ones', () => {
    expect(getQuerySuggestions('category:food,tra', today)).toEqual([
      'category:food,transportation',
      'category:food,travel',
    ]);
    expect(getQuerySuggestions('behavior:fixed,', today)).toEqual([
      'behavior:fixed,variable',
    ]);
  });

  it('suggests recent dates for date:', () => {
    expect(getQuerySuggestions('date:', today)).toEqual([
      'date:2026-10-01',
      'date:2026-09-30',
    ]);
  });

  it('only looks at the token being typed', () => {
    expect(getQuerySuggestions('type:expense c', today)).toEqual(['category:']);
  });

  it('returns nothing after whitespace, inside quotes, or for free-form keys', () => {
    expect(getQuerySuggestions('type:expense ', today)).toEqual([]);
    expect(getQuerySuggestions('source:"my b', today)).toEqual([]);
    expect(getQuerySuggestions('source:ca', today)).toEqual([]);
    expect(getQuerySuggestions('', today)).toEqual([]);
  });
});
