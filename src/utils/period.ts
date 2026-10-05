import {
  endOfDay,
  endOfWeek,
  endOfMonth,
  endOfYear,
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
} from 'date-fns';

export type Period = 'today' | 'week' | 'month' | 'year' | 'custom';

export interface CustomRange {
  startDate: Date | null;
  endDate: Date | null;
}

export const getPeriodRange = (
  period: Period,
  today: Date,
  custom?: CustomRange
): { start: Date; end: Date } => {
  switch (period) {
    case 'week':
      return { start: startOfWeek(today), end: endOfWeek(today) };
    case 'month':
      return { start: startOfMonth(today), end: endOfMonth(today) };
    case 'year':
      return { start: startOfYear(today), end: endOfYear(today) };
    case 'custom':
      return {
        start: custom?.startDate || startOfDay(today),
        end: custom?.endDate || endOfDay(today),
      };
    case 'today':
    default:
      return { start: startOfDay(today), end: endOfDay(today) };
  }
};
