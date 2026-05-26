import { useQuery } from '@tanstack/react-query';

import { statsApi } from '../../services/api';
import { ApiClient } from '../../types/shell';
import type { Stats } from '../../types/stats';
import { useShellService } from '../useShellService';

export type { Stats, TransactionByCategory, TransactionByDay, WeeklyComparisonItem } from '../../types/stats';

export const STATS_QUERY_KEY = 'stats';

export const useStats = () => {
  const apiClient = useShellService<ApiClient>('apiClient');

  return useQuery<Stats>({
    queryKey: [STATS_QUERY_KEY],
    queryFn: () => statsApi.fetchStats(apiClient!),
    enabled: !!apiClient,
  });
};
