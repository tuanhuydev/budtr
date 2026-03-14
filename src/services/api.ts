import { AUTH_URL } from '../configs/constants';
import type { Asset } from '../types/asset';
import { ExpenseBehavior } from '../types/common';
import type { ApiClient } from '../types/shell';
import type { Transaction } from '../types/transaction';

export interface FetchTransactionsParams {
  startDate?: Date | null;
  endDate?: Date | null;
  page?: number;
  pageSize?: number;
}

export interface FetchTransactionsResponse {
  transactions: Transaction[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateTransactionParams {
  type: string;
  category: string;
  amount: number;
  currency: string;
  behavior?: ExpenseBehavior;
  source?: string;
  description?: string;
  createdAt?: string;
}

export interface UpdateTransactionParams extends CreateTransactionParams {
  id: string | number;
}

export interface CreateAssetParams {
  name: string;
  type: string;
  currentBalance: number;
}

export interface UpdateAssetParams extends CreateAssetParams {
  id: string | number;
}

export const transactionsApi = {
  fetchTransactions: async (
    apiClient: ApiClient,
    params?: FetchTransactionsParams
  ): Promise<FetchTransactionsResponse> => {
    const urlParams = new URLSearchParams();
    if (params?.startDate) {
      urlParams.append('startDate', params.startDate.toISOString());
    }
    if (params?.endDate) {
      urlParams.append('endDate', params.endDate.toISOString());
    }
    if (params?.page !== undefined) {
      // DataGrid uses 0-based pages, backend expects 1-based
      urlParams.append('page', (params.page + 1).toString());
    }
    if (params?.pageSize !== undefined) {
      urlParams.append('pageSize', params.pageSize.toString());
    }

    const url = `${AUTH_URL}/transactions${
      urlParams.toString() ? `?${urlParams.toString()}` : ''
    }`;

    const response = await apiClient.request(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  },

  createTransaction: async (
    apiClient: ApiClient,
    data: CreateTransactionParams
  ): Promise<Transaction> => {
    const response = await apiClient.request(`${AUTH_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create transaction');
    }

    return response.json();
  },

  updateTransaction: async (
    apiClient: ApiClient,
    { id, ...data }: UpdateTransactionParams
  ): Promise<Transaction> => {
    const response = await apiClient.request(`${AUTH_URL}/transactions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update transaction');
    }

    return response.json();
  },

  deleteTransaction: async (
    apiClient: ApiClient,
    id: string | number
  ): Promise<void> => {
    const response = await apiClient.request(`${AUTH_URL}/transactions/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete transaction');
    }
  },
};

export const budgetsApi = {
  fetchBudgets: async (apiClient: ApiClient): Promise<unknown[]> => {
    const response = await apiClient.request(`${AUTH_URL}/budgets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch budgets');
    }

    return response.json();
  },
};

export const assetsApi = {
  fetchAssets: async (apiClient: ApiClient): Promise<Asset[]> => {
    const response = await apiClient.request(`${AUTH_URL}/assets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    }
    return data.assets ?? [];
  },

  createAsset: async (
    apiClient: ApiClient,
    data: CreateAssetParams
  ): Promise<Asset> => {
    const response = await apiClient.request(`${AUTH_URL}/assets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create asset');
    }

    return response.json();
  },

  updateAsset: async (
    apiClient: ApiClient,
    { id, ...data }: UpdateAssetParams
  ): Promise<Asset> => {
    const response = await apiClient.request(`${AUTH_URL}/assets/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update asset');
    }

    return response.json();
  },

  deleteAsset: async (apiClient: ApiClient, id: string | number) => {
    const response = await apiClient.request(`${AUTH_URL}/assets/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete asset');
    }
  },
};

// TODO: Enhance stats API and types
export const statsApi = {
  fetchStats: async (apiClient: ApiClient): Promise<unknown> => {
    const url = `${AUTH_URL}/transactions/stats`;

    const response = await apiClient.request(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return response.json();
  },
};
