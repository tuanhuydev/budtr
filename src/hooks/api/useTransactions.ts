import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  transactionsApi,
  FetchTransactionsParams,
  FetchTransactionSuggestionsParams,
  TRANSACTION_LIST_FILTER_KEYS,
  CreateTransactionParams,
  UpdateTransactionParams,
} from '../../services/api';
import type { ApiClient } from '../../types/shell';
import { useShellService } from '../useShellService';

import { ASSETS_QUERY_KEY } from './useAssets';
import { STATS_QUERY_KEY } from './useStats';

export const TRANSACTIONS_QUERY_KEY = 'transactions';

interface UseTransactionsOptions {
  /** Keep showing the previous result while a new filter set is loading. */
  keepPreviousData?: boolean;
}

export const useTransactions = (
  params?: FetchTransactionsParams,
  options?: UseTransactionsOptions
) => {
  const apiClient = useShellService<ApiClient>('apiClient');

  // Create a clean params object for query key stability
  // Convert dates to ISO strings for consistent serialization
  const cleanParams = params
    ? {
        ...(params.startDate && { startDate: params.startDate.toISOString() }),
        ...(params.endDate && { endDate: params.endDate.toISOString() }),
        ...(params.page !== undefined && { page: params.page }),
        ...(params.pageSize !== undefined && { pageSize: params.pageSize }),
        ...Object.fromEntries(
          TRANSACTION_LIST_FILTER_KEYS.filter(key => params[key]?.length).map(
            key => [key, params[key]]
          )
        ),
        ...(params.search?.trim() && { search: params.search.trim() }),
      }
    : undefined;

  return useQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY, cleanParams],
    queryFn: () => transactionsApi.fetchTransactions(apiClient!, params),
    enabled: !!apiClient,
    placeholderData: options?.keepPreviousData ? keepPreviousData : undefined,
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
      queryClient.invalidateQueries({ queryKey: [ASSETS_QUERY_KEY] });
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
      queryClient.invalidateQueries({ queryKey: [ASSETS_QUERY_KEY] });
    },
  });
};

export const useTransactionSuggestions = (
  params: FetchTransactionSuggestionsParams
) => {
  const apiClient = useShellService<ApiClient>('apiClient');

  return useQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY, 'suggestions', params],
    queryFn: () => transactionsApi.fetchSuggestions(apiClient!, params),
    enabled: !!apiClient && params.amount > 0,
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
      queryClient.invalidateQueries({ queryKey: [ASSETS_QUERY_KEY] });
    },
  });
};
