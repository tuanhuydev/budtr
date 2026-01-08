import { useQuery } from '@tanstack/react-query';

import { FetchExpensesParams, statsApi } from '../../services/api';
import { ApiClient } from '../../types/shell';
import { useShellService } from '../useShellService';

export const STATS_QUERY_KEY = 'stats';

export type Stats = {
  balance: number;
  count: number;
  totalExpenses: number;
  totalIncome: number;
};

export const useStats = (params?: FetchExpensesParams) => {
  const apiClient = useShellService<ApiClient>('apiClient');

  return useQuery<Stats>({
    queryKey: [STATS_QUERY_KEY, params],
    queryFn: () => statsApi.fetchStats(apiClient!, params),
    enabled: !!apiClient,
  });
};
