import type { Transaction } from './transaction';

export type WeeklyComparisonItem = {
  label: string;
  [key: string]: string | number;
};

export type TransactionByCategory = {
  key: string;
  amount: number;
  count: number;
};

export type TransactionByDay = {
  day: string;
  amount: number;
  count: number;
};

export type Stats = {
  balance: number;
  count: number;
  totalExpenses: number;
  totalIncome: number;
  weeklyComparison?: WeeklyComparisonItem[];
  weeklyTransactions?: TransactionByCategory[];
  currentWeek?: TransactionByDay[];
  topTransactions?: Transaction[];
};
