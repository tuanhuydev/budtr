import { Typography, TypographyProps } from '@mui/material';

import { tabularNums } from '@/configs/theme';
import { ExpenseType } from '@/types/common';
import { formatTransactionAmount } from '@/utils/transactionFormatter';

interface MoneyTextProps extends Omit<TypographyProps, 'color'> {
  amount: number;
  type: ExpenseType;
  currency?: string;
}

const colorFor = (type: ExpenseType) => {
  if (type === ExpenseType.INCOME) return 'success.main';
  if (type === ExpenseType.TRANSFER) return 'text.secondary';
  return 'error.dark';
};

export const MoneyText = ({
  amount,
  type,
  currency,
  sx,
  ...rest
}: MoneyTextProps) => (
  <Typography
    variant='body1'
    {...rest}
    sx={[
      { fontWeight: 600, color: colorFor(type), ...tabularNums },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {formatTransactionAmount(amount || 0, type, currency).displayText}
  </Typography>
);
