import { ExpenseType } from '@/types/common';

export interface FormattedAmount {
  displayText: string;
  color: 'green' | 'red';
  sign: '+' | '-';
}

export const formatChartValue = (value: number): string => {
  const absValue = Math.abs(value);
  const formatScaledValue = (scaledValue: number): string =>
    scaledValue.toFixed(1).replace(/\.0$/, '');

  if (absValue >= 1_000_000_000) {
    return `${formatScaledValue(value / 1_000_000_000)} bil`;
  }
  if (absValue >= 1_000_000) {
    const roundedInMillions = Number((absValue / 1_000_000).toFixed(1));
    if (roundedInMillions >= 1000) {
      return `${formatScaledValue(value / 1_000_000_000)} bil`;
    }

    return `${formatScaledValue(value / 1_000_000)} mil`;
  }
  if (absValue >= 1_000) {
    const roundedInThousands = Number((absValue / 1_000).toFixed(1));
    if (roundedInThousands >= 1000) {
      return `${formatScaledValue(value / 1_000_000)} mil`;
    }

    return `${formatScaledValue(value / 1_000)}k`;
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
