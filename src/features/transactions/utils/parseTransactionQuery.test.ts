import { describe, expect, it } from 'vitest';

import {
  hasUnclosedQuote,
  isValidDateString,
  parseTransactionQuery,
  resolveEnumValue,
  tokenizeQuery,
} from './parseTransactionQuery';

describe('tokenizeQuery', () => {
  it('splits on whitespace outside quotes', () => {
    expect(tokenizeQuery('a  b\tc')).toEqual(['a', 'b', 'c']);
    expect(tokenizeQuery('description:"coffee shop" x')).toEqual([
      'description:"coffee shop"',
      'x',
    ]);
  });

  it('lets an unbalanced quote run to the end of the input', () => {
    expect(tokenizeQuery('source:"a b c')).toEqual(['source:"a b c']);
    expect(hasUnclosedQuote('source:"a b')).toBe(true);
    expect(hasUnclosedQuote('source:"a b"')).toBe(false);
  });

  it('returns nothing for empty input', () => {
    expect(tokenizeQuery('')).toEqual([]);
    expect(tokenizeQuery('   ')).toEqual([]);
  });
});

describe('resolveEnumValue', () => {
  it('matches exact values case-insensitively', () => {
    expect(resolveEnumValue('category', 'Food')).toBe('FOOD');
  });

  it('matches a unique prefix', () => {
    expect(resolveEnumValue('category', 'transport')).toBe('TRANSPORTATION');
    expect(resolveEnumValue('type', 'exp')).toBe('EXPENSE');
  });

  it('rejects ambiguous and unknown values', () => {
    expect(resolveEnumValue('category', 'e')).toBeUndefined(); // EDUCATION / ENTERTAINMENT
    expect(resolveEnumValue('category', 'nope')).toBeUndefined();
    expect(resolveEnumValue('category', '')).toBeUndefined();
  });
});

describe('isValidDateString', () => {
  it('accepts real dates and rejects impossible ones', () => {
    expect(isValidDateString('2026-08-30')).toBe(true);
    expect(isValidDateString('2024-02-29')).toBe(true);
    expect(isValidDateString('2026-02-30')).toBe(false);
    expect(isValidDateString('2026-8-3')).toBe(false);
    expect(isValidDateString('tomorrow')).toBe(false);
  });
});

describe('parseTransactionQuery', () => {
  it('parses key:value facets', () => {
    const q = parseTransactionQuery('category:food type:expense');
    expect(q.category.include).toEqual(['FOOD']);
    expect(q.type.include).toEqual(['EXPENSE']);
    expect(q.freeText).toBe('');
    expect(q.tokens.every(t => t.kind === 'facet' && t.valid)).toBe(true);
  });

  it('is case-insensitive for keys and values', () => {
    const q = parseTransactionQuery('CATEGORY:Food');
    expect(q.category.include).toEqual(['FOOD']);
  });

  it('supports comma-separated OR values', () => {
    const q = parseTransactionQuery('category:food,transport,food');
    expect(q.category.include).toEqual(['FOOD', 'TRANSPORTATION']);
  });

  it('supports negation with a leading dash', () => {
    const q = parseTransactionQuery('-category:food -type:income');
    expect(q.category.exclude).toEqual(['FOOD']);
    expect(q.category.include).toEqual([]);
    expect(q.type.exclude).toEqual(['INCOME']);
  });

  it('merges repeated facets of the same key', () => {
    const q = parseTransactionQuery('category:food category:travel');
    expect(q.category.include).toEqual(['FOOD', 'TRAVEL']);
  });

  it('keeps source values as free strings and supports quotes', () => {
    const q = parseTransactionQuery('source:"my bank",cash');
    expect(q.source.include).toEqual(['my bank', 'cash']);
  });

  it('treats unmatched tokens as free text', () => {
    const q = parseTransactionQuery('coffee category:food shop');
    expect(q.freeText).toBe('coffee shop');
  });

  it('keeps quoted free text together', () => {
    const q = parseTransactionQuery('"coffee shop" type:expense');
    expect(q.freeText).toBe('coffee shop');
  });

  it('treats description: as an alias for free text', () => {
    const q = parseTransactionQuery('description:"coffee shop"');
    expect(q.freeText).toBe('coffee shop');
    expect(q.tokens[0].valid).toBe(true);
  });

  it('parses a single-day date facet', () => {
    const q = parseTransactionQuery('date:2026-08-30 category:food');
    expect(q.date).toBe('2026-08-30');
    expect(q.freeText).toBe('');
  });

  describe('degrades gracefully to free text', () => {
    it.each([
      ['unknown key', 'foo:bar', 'foo:bar'],
      ['unknown enum value', 'category:nope', 'category:nope'],
      ['partially valid values', 'category:food,nope', 'category:food,nope'],
      ['missing value', 'category:', 'category:'],
      ['impossible date', 'date:2026-02-30', 'date:2026-02-30'],
      ['malformed date', 'date:today', 'date:today'],
      ['negated date', '-date:2026-08-30', '-date:2026-08-30'],
      [
        'multiple dates in one token',
        'date:2026-08-30,2026-08-31',
        'date:2026-08-30,2026-08-31',
      ],
      ['leading colon', ':food', ':food'],
      ['lone dash', '-', '-'],
      ['quoted invalid facet', 'category:"nope nope"', 'category:nope nope'],
    ])('%s', (_name, input, expectedText) => {
      const q = parseTransactionQuery(input);
      expect(q.freeText).toBe(expectedText);
      expect(q.date).toBeUndefined();
      expect(q.category.include).toEqual([]);
    });

    it('marks unrecognized facet-like tokens as invalid but known keys only', () => {
      const q = parseTransactionQuery('category:nope foo:bar');
      expect(q.tokens[0]).toMatchObject({
        kind: 'text',
        key: 'category',
        valid: false,
      });
      // An unknown key is just text, not an "invalid facet".
      expect(q.tokens[1]).toMatchObject({ kind: 'text', valid: true });
    });

    it('applies only the first date facet', () => {
      const q = parseTransactionQuery('date:2026-08-30 date:2026-08-31');
      expect(q.date).toBe('2026-08-30');
      expect(q.freeText).toBe('date:2026-08-31');
      expect(q.tokens[1].valid).toBe(false);
    });
  });

  it('never throws on hostile input', () => {
    const inputs = [
      '',
      ' ',
      ':',
      '::',
      '-',
      '--',
      '-:',
      '"',
      '""',
      'key:"',
      'category:"',
      'category:,,,',
      'category:"food',
      '-"',
      'date:',
      'a:b:c',
      '\n\t',
      'x'.repeat(10_000),
      '"'.repeat(1001),
    ];
    for (const input of inputs) {
      expect(() => parseTransactionQuery(input)).not.toThrow();
    }
    expect(() =>
      parseTransactionQuery(undefined as unknown as string)
    ).not.toThrow();
    expect(() =>
      parseTransactionQuery(null as unknown as string)
    ).not.toThrow();
  });

  it('returns an empty result for empty input', () => {
    const q = parseTransactionQuery('');
    expect(q.tokens).toEqual([]);
    expect(q.freeText).toBe('');
  });
});
