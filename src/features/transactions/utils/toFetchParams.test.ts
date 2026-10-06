import { describe, expect, it } from 'vitest';

import { parseTransactionQuery } from './parseTransactionQuery';
import { toFetchParams } from './toFetchParams';

const range = {
  startDate: new Date(2026, 9, 1),
  endDate: new Date(2026, 9, 31),
};

describe('toFetchParams', () => {
  it('uses the date-range picker when there is no date facet', () => {
    const params = toFetchParams(parseTransactionQuery('category:food'), range);
    expect(params.startDate).toBe(range.startDate);
    expect(params.endDate).toBe(range.endDate);
    expect(params.category).toEqual(['FOOD']);
  });

  it('overrides the range with a single local day for date:', () => {
    const params = toFetchParams(
      parseTransactionQuery('date:2026-08-30'),
      range
    );
    expect(params.startDate).toEqual(new Date(2026, 7, 30, 0, 0, 0, 0));
    expect(params.endDate).toEqual(new Date(2026, 7, 30, 23, 59, 59, 999));
  });

  it('maps facets, negation and free text', () => {
    const params = toFetchParams(
      parseTransactionQuery(
        'category:food,travel -behavior:fixed -type:income source:cash coffee'
      ),
      range
    );
    expect(params).toMatchObject({
      category: ['FOOD', 'TRAVEL'],
      excludeBehavior: ['FIXED'],
      excludeType: ['INCOME'],
      source: ['cash'],
      search: 'coffee',
    });
    expect(params.behavior).toBeUndefined();
    expect(params.excludeCategory).toBeUndefined();
  });

  it('omits empty filters', () => {
    const params = toFetchParams(parseTransactionQuery(''), range);
    expect(params.search).toBeUndefined();
    expect(params.category).toBeUndefined();
  });
});
