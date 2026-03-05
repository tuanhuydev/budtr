import { ExpenseType } from '@/types/common';

export interface FormattedAmount {
  displayText: string;
  color: 'green' | 'red';
  sign: '+' | '-';
}

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
