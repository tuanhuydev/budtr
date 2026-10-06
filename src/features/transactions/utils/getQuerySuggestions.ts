import { format, subDays } from 'date-fns';

import {
  FACET_KEYS,
  FACET_VALUES,
  hasUnclosedQuote,
  tokenizeQuery,
} from './parseTransactionQuery';

/**
 * Suggestions for the token currently being typed (the last one). Returned
 * strings are full replacement tokens: facet keys end with `:` (the caller
 * keeps them in the input), complete `key:value` strings can be committed.
 */
export const getQuerySuggestions = (
  input: string,
  today: Date = new Date()
): string[] => {
  if (!input || /\s$/.test(input) || hasUnclosedQuote(input)) return [];
  const current = tokenizeQuery(input).pop() ?? '';
  const negation = current.startsWith('-') ? '-' : '';
  const body = negation ? current.slice(1) : current;
  if (!body) return [];

  const colon = body.indexOf(':');
  if (colon === -1) {
    const needle = body.toLowerCase();
    return FACET_KEYS.filter(key => key.startsWith(needle)).map(
      key => `${negation}${key}:`
    );
  }

  const key = body.slice(0, colon).toLowerCase();
  const valuePart = body.slice(colon + 1);
  const prefix = `${negation}${key}:`;

  if (key === 'date') {
    if (negation) return [];
    return [
      format(today, 'yyyy-MM-dd'),
      format(subDays(today, 1), 'yyyy-MM-dd'),
    ]
      .filter(date => date.startsWith(valuePart))
      .map(date => `${prefix}${date}`);
  }

  if (key !== 'category' && key !== 'type' && key !== 'behavior') return [];

  // Complete the last comma-separated value; keep the ones already typed.
  const lastComma = valuePart.lastIndexOf(',');
  const done = valuePart.slice(0, lastComma + 1);
  const used = done.toLowerCase().split(',');
  const needle = valuePart.slice(lastComma + 1).toLowerCase();
  return FACET_VALUES[key]
    .filter(
      option =>
        option.toLowerCase().startsWith(needle) &&
        !used.includes(option.toLowerCase())
    )
    .map(option => `${prefix}${done}${option.toLowerCase()}`);
};
