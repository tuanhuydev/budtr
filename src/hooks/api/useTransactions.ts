import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  transactionsApi,
  FetchTransactionsParams,
  CreateTransactionParams,
  UpdateTransactionParams,
} from '../../services/api';
import type { ApiClient } from '../../types/shell';
import { useShellService } from '../useShellService';

import { STATS_QUERY_KEY } from './useStats';

export const TRANSACTIONS_QUERY_KEY = 'transactions';

export const useTransactions = (params?: FetchTransactionsParams) => {
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
    queryKey: [TRANSACTIONS_QUERY_KEY, cleanParams],
    queryFn: () => transactionsApi.fetchTransactions(apiClient!, params),
    enabled: !!apiClient,
  });
};

export const useCreateTransaction = () => {
  const apiClient = useShellService<ApiClient>('apiClient');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionParams) =>
      transactionsApi.createTransaction(apiClient!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
    },
  });
};

export const useUpdateTransaction = () => {
  const apiClient = useShellService<ApiClient>('apiClient');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTransactionParams) =>
      transactionsApi.updateTransaction(apiClient!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
    },
  });
};

export const useDeleteTransaction = () => {
  const apiClient = useShellService<ApiClient>('apiClient');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) =>
      transactionsApi.deleteTransaction(apiClient!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
    },
  });
};
