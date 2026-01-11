import { useQuery } from '@tanstack/react-query';

import { budgetsApi } from '../../services/api';
import type { ApiClient } from '../../types/shell';
import { useShellService } from '../useShellService';

export const BUDGETS_QUERY_KEY = 'budgets';

export const useBudgets = () => {
  const apiClient = useShellService<ApiClient>('apiClient');

  return useQuery({
    queryKey: [BUDGETS_QUERY_KEY],
    queryFn: () => budgetsApi.fetchBudgets(apiClient!),
    enabled: !!apiClient,
  });
};
