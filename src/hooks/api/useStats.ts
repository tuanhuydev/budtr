import { useQuery } from '@tanstack/react-query';

import {
  statsApi,
  StatsResponse,
  TransactionByCategory,
  TransactionByDay,
} from '../../services/api';
import { ApiClient } from '../../types/shell';
import { useShellService } from '../useShellService';

export const STATS_QUERY_KEY = 'stats';

export type { TransactionByCategory, TransactionByDay };

export type WeeklyComparisonItem = Record<string, unknown>;

export type Stats = StatsResponse;

export const useStats = () => {
  const apiClient = useShellService<ApiClient>('apiClient');

  return useQuery<Stats>({
    queryKey: [STATS_QUERY_KEY],
    queryFn: () => statsApi.fetchStats(apiClient!),
    enabled: !!apiClient,
  });
};
