import { useQuery } from '@tanstack/react-query';

import { statsApi } from '../../services/api';
import { Expense } from '../../types/expense';
import { ApiClient } from '../../types/shell';
import { useShellService } from '../useShellService';

export const STATS_QUERY_KEY = 'stats';

export type WeeklyComparisonItem = {
  label: string;
  [key: string]: string | number;
};

export type ExpenseByCategory = {
  key: string;
  amount: number;
  count: number;
};

export type ExpenseByDay = {
  day: string;
  amount: number;
  count: number;
};

export type Stats = {
  balance: number;
  count: number;
  totalExpenses: number;
  totalIncome: number;
  weeklyComparison?: WeeklyComparisonItem[];
  weeklyExpenses?: ExpenseByCategory[];
  currentWeek?: ExpenseByDay[];
  topExpenses?: Expense[];
};

export const useStats = () => {
  const apiClient = useShellService<ApiClient>('apiClient');

  return useQuery<Stats>({
    queryKey: [STATS_QUERY_KEY],
    queryFn: () => statsApi.fetchStats(apiClient!),
    enabled: !!apiClient,
  });
};
