import { endOfDay, startOfDay } from 'date-fns';

import type { DateRange } from '@/components/DateRangePicker';
import type { FetchTransactionsParams } from '@/services/api';

import type { ParsedQuery } from './parseTransactionQuery';

type FilterParams = Pick<
  FetchTransactionsParams,
  | 'startDate'
  | 'endDate'
  | 'type'
  | 'category'
  | 'behavior'
  | 'source'
  | 'excludeType'
  | 'excludeCategory'
  | 'excludeBehavior'
  | 'excludeSource'
  | 'search'
>;

const orUndefined = (values: string[]) => (values.length ? values : undefined);

/** Parses `YYYY-MM-DD` as a local calendar day. */
const parseLocalDay = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Maps a parsed query onto transaction list params. A `date:` facet overrides
 * the date-range picker with a single-day range.
 */
export const toFetchParams = (
  parsed: ParsedQuery,
  dateRange: DateRange
): FilterParams => {
  const day = parsed.date ? parseLocalDay(parsed.date) : undefined;
  return {
    startDate: day ? startOfDay(day) : dateRange.startDate,
    endDate: day ? endOfDay(day) : dateRange.endDate,
    type: orUndefined(parsed.type.include),
    category: orUndefined(parsed.category.include),
    behavior: orUndefined(parsed.behavior.include),
    source: orUndefined(parsed.source.include),
    excludeType: orUndefined(parsed.type.exclude),
    excludeCategory: orUndefined(parsed.category.exclude),
    excludeBehavior: orUndefined(parsed.behavior.exclude),
    excludeSource: orUndefined(parsed.source.exclude),
    search: parsed.freeText || undefined,
  };
};
