import { ExpenseType } from '@/types/common';

export interface FormattedAmount {
  displayText: string;
  color: 'green' | 'red';
  sign: '+' | '-';
}

export const formatChartValue = (value: number): string => {
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, '')} bil`;
  }
  if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')} mil`;
  }
  if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return value.toFixed(0);
};

export const formatTransactionAmount = (
  amount: number,
  type: ExpenseType,
  currency?: string
): FormattedAmount => {
  const isIncome = type === ExpenseType.INCOME;
  const sign = isIncome ? '+' : '-';
  const color = isIncome ? 'green' : 'red';
  const displayText = currency
    ? `${sign}${amount?.toLocaleString() || 0} ${currency}`
    : `${sign}${amount?.toLocaleString() || 0}`;

  return { displayText, color, sign };
};
