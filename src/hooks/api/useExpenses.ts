import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  expensesApi,
  FetchExpensesParams,
  CreateExpenseParams,
  UpdateExpenseParams,
} from '../../services/api';
import type { ApiClient } from '../../types/shell';
import { useShellService } from '../useShellService';

import { STATS_QUERY_KEY } from './useStats';

export const EXPENSES_QUERY_KEY = 'expenses';

export const useExpenses = (params?: FetchExpensesParams) => {
  const apiClient = useShellService<ApiClient>('apiClient');

  // Create a clean params object for query key stability
  // Convert dates to ISO strings for consistent serialization
  const cleanParams = params
    ? {
        ...(params.startDate && { startDate: params.startDate.toISOString() }),
        ...(params.endDate && { endDate: params.endDate.toISOString() }),
        ...(params.page !== undefined && { page: params.page }),
        ...(params.pageSize !== undefined && { pageSize: params.pageSize }),
      }
    : undefined;

  return useQuery({
    queryKey: [EXPENSES_QUERY_KEY, cleanParams],
    queryFn: () => expensesApi.fetchExpenses(apiClient!, params),
    enabled: !!apiClient,
  });
};

export const useCreateExpense = () => {
  const apiClient = useShellService<ApiClient>('apiClient');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseParams) =>
      expensesApi.createExpense(apiClient!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
    },
  });
};

export const useUpdateExpense = () => {
  const apiClient = useShellService<ApiClient>('apiClient');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateExpenseParams) =>
      expensesApi.updateExpense(apiClient!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
    },
  });
};

export const useDeleteExpense = () => {
  const apiClient = useShellService<ApiClient>('apiClient');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) =>
      expensesApi.deleteExpense(apiClient!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
    },
  });
};
