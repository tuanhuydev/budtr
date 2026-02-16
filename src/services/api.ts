import { AUTH_URL } from '../configs/constants';
import { ExpenseBehavior } from '../types/common';
import type { Expense } from '../types/expense';
import type { ApiClient } from '../types/shell';

export interface FetchExpensesParams {
  startDate?: Date | null;
  endDate?: Date | null;
  page?: number;
  pageSize?: number;
}

export interface FetchExpensesResponse {
  expenses: Expense[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateExpenseParams {
  type: string;
  category: string;
  amount: number;
  currency: string;
  behavior?: ExpenseBehavior;
  source?: string;
  description?: string;
  createdAt?: string;
}

export interface UpdateExpenseParams extends CreateExpenseParams {
  id: string | number;
}

export const expensesApi = {
  fetchExpenses: async (
    apiClient: ApiClient,
    params?: FetchExpensesParams
  ): Promise<FetchExpensesResponse> => {
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

    const url = `${AUTH_URL}/expenses${
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

  createExpense: async (
    apiClient: ApiClient,
    data: CreateExpenseParams
  ): Promise<Expense> => {
    const response = await apiClient.request(`${AUTH_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create expense');
    }

    return response.json();
  },

  updateExpense: async (
    apiClient: ApiClient,
    { id, ...data }: UpdateExpenseParams
  ): Promise<Expense> => {
    const response = await apiClient.request(`${AUTH_URL}/expenses/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update expense');
    }

    return response.json();
  },

  deleteExpense: async (
    apiClient: ApiClient,
    id: string | number
  ): Promise<void> => {
    const response = await apiClient.request(`${AUTH_URL}/expenses/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }
  },
};

export const budgetsApi = {
  fetchBudgets: async (apiClient: ApiClient): Promise<any[]> => {
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

// TODO: Enhance stats API and types
export const statsApi = {
  fetchStats: async (apiClient: ApiClient): Promise<any> => {
    const url = `${AUTH_URL}/expenses/stats`;

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
