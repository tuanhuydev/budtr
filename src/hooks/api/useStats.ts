import { useQuery } from '@tanstack/react-query';

import { statsApi } from '../../services/api';
import { ApiClient } from '../../types/shell';
import { useShellService } from '../useShellService';

export const STATS_QUERY_KEY = 'stats';

export type WeeklyComparisonItem = {
  label: string;
  [key: string]: string | number;
};

export type Stats = {
  balance: number;
  count: number;
  totalExpenses: number;
  totalIncome: number;
  weeklyComparison?: WeeklyComparisonItem[];
};

export const useStats = () => {
  const apiClient = useShellService<ApiClient>('apiClient');

  return useQuery<Stats>({
    queryKey: [STATS_QUERY_KEY],
    queryFn: () => statsApi.fetchStats(apiClient!),
    enabled: !!apiClient,
  });
};
