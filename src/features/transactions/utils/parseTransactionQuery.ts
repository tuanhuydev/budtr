import { ExpenseBehavior, ExpenseCategory, ExpenseType } from '@/types/common';

/**
 * Pure parser for the transactions search-box query syntax, e.g.
 *
 *   date:2026-08-30 category:food,transport -type:income "coffee shop"
 *
 * - `key:value` tokens are space separated; quote values containing spaces
 * - commas separate OR values; a leading `-` negates a token
 * - anything that is not a valid facet degrades to free text, never throws
 */

export const FACET_KEYS = [
  'date',
  'category',
  'type',
  'behavior',
  'source',
] as const;
export type FacetKey = (typeof FACET_KEYS)[number];

type EnumFacetKey = Exclude<FacetKey, 'date' | 'source'>;

export const FACET_VALUES: Record<EnumFacetKey, readonly string[]> = {
  category: Object.values(ExpenseCategory),
  type: Object.values(ExpenseType),
  behavior: Object.values(ExpenseBehavior),
};

export interface QueryToken {
  /** Token exactly as typed (quotes included). */
  raw: string;
  /** `facet` when it is a valid facet filter, otherwise `text`. */
  kind: 'facet' | 'text';
  key?: FacetKey;
  negated: boolean;
  /** Normalized values (enum values for enum facets, `YYYY-MM-DD` for date). */
  values: string[];
  /** False when the token looked like a facet but could not be applied. */
  valid: boolean;
}

export interface FacetFilter {
  include: string[];
  exclude: string[];
}

export interface ParsedQuery {
  tokens: QueryToken[];
  category: FacetFilter;
  type: FacetFilter;
  behavior: FacetFilter;
  source: FacetFilter;
  /** Single-day filter as `YYYY-MM-DD`; overrides the date-range picker. */
  date?: string;
  /** Remaining free text, searched against the description. */
  freeText: string;
}

const isWhitespace = (ch: string) => /\s/.test(ch);

/**
 * Splits a query into raw tokens on whitespace that is outside double quotes.
 * An unbalanced quote swallows the rest of the input instead of failing.
 */
export const tokenizeQuery = (input: string): string[] => {
  const tokens: string[] = [];
  let current = '';
  let inQuotes = false;

  for (const ch of input ?? '') {
    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
    } else if (!inQuotes && isWhitespace(ch)) {
      if (current) tokens.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current) tokens.push(current);
  return tokens;
};

/** True when the input ends inside an unclosed double quote. */
export const hasUnclosedQuote = (input: string): boolean =>
  ((input ?? '').match(/"/g) ?? []).length % 2 === 1;

const stripQuotes = (value: string): string => value.replace(/"/g, '');

/** Splits on commas that are outside double quotes. */
const splitValues = (value: string): string[] => {
  const parts: string[] = [];
  let current = '';
  let inQuotes = false;
  for (const ch of value) {
    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
    } else if (ch === ',' && !inQuotes) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts.map(part => stripQuotes(part).trim()).filter(Boolean);
};

/**
 * Resolves user input to an enum value: exact match (case-insensitive) first,
 * then a unique prefix match, so `transport` finds TRANSPORTATION. Ambiguous
 * or unknown input resolves to undefined.
 */
export const resolveEnumValue = (
  key: EnumFacetKey,
  input: string
): string | undefined => {
  const needle = input.trim().toLowerCase();
  if (!needle) return undefined;
  const options = FACET_VALUES[key];
  const exact = options.find(option => option.toLowerCase() === needle);
  if (exact) return exact;
  const prefixed = options.filter(option =>
    option.toLowerCase().startsWith(needle)
  );
  return prefixed.length === 1 ? prefixed[0] : undefined;
};

/** Strict `YYYY-MM-DD` check that rejects impossible dates like 2026-02-31. */
export const isValidDateString = (value: string): boolean => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [year, month, day] = [+match[1], +match[2], +match[3]];
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const FACET_KEY_SET = new Set<string>(FACET_KEYS);

const textToken = (raw: string, valid = true): QueryToken => ({
  raw,
  kind: 'text',
  negated: false,
  values: [stripQuotes(raw)],
  valid,
});

/** Parses one raw token; always returns a token, never throws. */
const parseToken = (raw: string): QueryToken => {
  const negated = raw.startsWith('-');
  const body = negated ? raw.slice(1) : raw;
  const colon = body.indexOf(':');
  if (colon <= 0) return textToken(raw);

  const rawKey = body.slice(0, colon);
  const key = rawKey.toLowerCase();
  // `description:` is accepted as an explicit alias for free text.
  if (key === 'description' && !negated) {
    const text = stripQuotes(body.slice(colon + 1)).trim();
    return { ...textToken(raw, !!text), values: [text] };
  }
  if (!FACET_KEY_SET.has(key)) return textToken(raw);

  const facetKey = key as FacetKey;
  const rawValues = splitValues(body.slice(colon + 1));
  const invalid: QueryToken = { ...textToken(raw, false), key: facetKey };
  if (!rawValues.length) return invalid;

  if (facetKey === 'date') {
    const [value] = rawValues;
    if (negated || rawValues.length !== 1 || !isValidDateString(value)) {
      return invalid;
    }
    return {
      raw,
      kind: 'facet',
      key: facetKey,
      negated: false,
      values: [value],
      valid: true,
    };
  }

  let values: string[];
  if (facetKey === 'source') {
    values = rawValues;
  } else {
    const resolved = rawValues.map(value => resolveEnumValue(facetKey, value));
    if (resolved.some(value => value === undefined)) return invalid;
    values = Array.from(new Set(resolved as string[]));
  }
  return { raw, kind: 'facet', key: facetKey, negated, values, valid: true };
};

const emptyFilter = (): FacetFilter => ({ include: [], exclude: [] });

export const parseTransactionQuery = (input: string): ParsedQuery => {
  const parsed: ParsedQuery = {
    tokens: [],
    category: emptyFilter(),
    type: emptyFilter(),
    behavior: emptyFilter(),
    source: emptyFilter(),
    freeText: '',
  };
  const text: string[] = [];

  for (const raw of tokenizeQuery(typeof input === 'string' ? input : '')) {
    let token = parseToken(raw);

    // Only the first date facet applies; later ones fall back to free text.
    if (token.kind === 'facet' && token.key === 'date') {
      if (parsed.date) token = { ...textToken(raw, false), key: 'date' };
      else parsed.date = token.values[0];
    }

    if (token.kind === 'facet' && token.key && token.key !== 'date') {
      const filter = parsed[token.key];
      const target = token.negated ? filter.exclude : filter.include;
      token.values.forEach(value => {
        if (!target.includes(value)) target.push(value);
      });
    } else if (token.kind === 'text') {
      // Invalid facets keep their original text so nothing the user typed is lost.
      const value = token.values[0].trim();
      if (value) text.push(value);
    }
    parsed.tokens.push(token);
  }

  parsed.freeText = text.join(' ');
  return parsed;
};
