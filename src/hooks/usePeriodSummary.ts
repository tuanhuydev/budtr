import { useMemo } from 'react';

import { ExpenseBehavior, ExpenseType } from '@/types/common';
import { Period, CustomRange, getPeriodRange } from '@/utils/period';

import { useTransactions } from './api/useTransactions';

export interface PeriodSummary {
  spent: number;
  currency: string;
  /** Fixed share of expenses, 0-100 (rounded); null when no expenses. */
  fixedShare: number | null;
  topCategory: { category: string; share: number } | null;
}

export const usePeriodSummary = (
  period: Period,
  today: Date,
  custom?: CustomRange
) => {
  const { start, end } = getPeriodRange(period, today, custom);
  const { data, isLoading } = useTransactions({
    startDate: start,
    endDate: end,
  });

  const summary = useMemo<PeriodSummary | null>(() => {
    if (!data) return null;
    const expenses = data.transactions.filter(
      tx => tx.type === ExpenseType.EXPENSE
    );
    const spent = expenses.reduce((sum, tx) => sum + tx.amount, 0);
    if (expenses.length === 0 || spent <= 0) {
      return { spent: 0, currency: 'VND', fixedShare: null, topCategory: null };
    }
    const fixed = expenses
      .filter(tx => tx.behavior === ExpenseBehavior.FIXED)
      .reduce((sum, tx) => sum + tx.amount, 0);
    const byCategory: Record<string, number> = {};
    expenses.forEach(tx => {
      const key = tx.category || 'OTHER';
      byCategory[key] = (byCategory[key] ?? 0) + tx.amount;
    });
    const [category, amount] = Object.entries(byCategory).sort(
      (a, b) => b[1] - a[1]
    )[0];
    return {
      spent,
      currency: expenses[0].currency || 'VND',
      fixedShare: Math.round((fixed / spent) * 100),
      topCategory: { category, share: (amount / spent) * 100 },
    };
  }, [data]);

  return { summary, isLoading };
};
