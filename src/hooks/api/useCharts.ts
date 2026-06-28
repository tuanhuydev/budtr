import { useQuery } from '@tanstack/react-query';

import { chartsApi } from '../../services/api';
import type {
  BudgetVsActualChart,
  CategoryBreakdownChart,
  MonthlyComparisonChart,
  SavingsProgressChart,
  SpendingTrendsChart,
} from '../../types/charts';
import type { ApiClient } from '../../types/shell';
import { useShellService } from '../useShellService';

const CHARTS_KEY = 'charts';

export const useBudgetVsActual = () => {
  const apiClient = useShellService<ApiClient>('apiClient');
  return useQuery<BudgetVsActualChart>({
    queryKey: [CHARTS_KEY, 'budget_vs_actual'],
    queryFn: () => chartsApi.fetchBudgetVsActual(apiClient!),
    enabled: !!apiClient,
  });
};

export const useSpendingTrends = () => {
  const apiClient = useShellService<ApiClient>('apiClient');
  return useQuery<SpendingTrendsChart>({
    queryKey: [CHARTS_KEY, 'spending_trends'],
    queryFn: () => chartsApi.fetchSpendingTrends(apiClient!),
    enabled: !!apiClient,
  });
};

export const useCategoryBreakdown = () => {
  const apiClient = useShellService<ApiClient>('apiClient');
  return useQuery<CategoryBreakdownChart>({
    queryKey: [CHARTS_KEY, 'category_breakdown'],
    queryFn: () => chartsApi.fetchCategoryBreakdown(apiClient!),
    enabled: !!apiClient,
  });
};

export const useMonthlyComparison = () => {
  const apiClient = useShellService<ApiClient>('apiClient');
  return useQuery<MonthlyComparisonChart>({
    queryKey: [CHARTS_KEY, 'monthly_comparison'],
    queryFn: () => chartsApi.fetchMonthlyComparison(apiClient!),
    enabled: !!apiClient,
  });
};

export const useSavingsProgress = () => {
  const apiClient = useShellService<ApiClient>('apiClient');
  return useQuery<SavingsProgressChart>({
    queryKey: [CHARTS_KEY, 'savings_progress'],
    queryFn: () => chartsApi.fetchSavingsProgress(apiClient!),
    enabled: !!apiClient,
  });
};
