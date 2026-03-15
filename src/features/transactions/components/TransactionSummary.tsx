import { Box, SxProps, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useMemo } from 'react';

import { useBudtrTranslation } from '@/hooks/useI18n';
import { ExpenseType, Transaction } from '@/types/transaction';
import { formatTransactionAmount } from '@/utils/transactionFormatter';

import { CATEGORY_COLORS } from '../../../configs/constants';

interface TransactionSummaryProps {
  transactions: Transaction[];
}

export const TransactionSummary = ({
  transactions,
}: TransactionSummaryProps) => {
  const { t } = useBudtrTranslation();

  const { income, expense, total } = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const tx of transactions) {
      if (tx.type === ExpenseType.INCOME) {
        income += tx.amount;
      } else {
        expense += tx.amount;
      }
    }
    return { income, expense, total: income - expense };
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const tx of transactions) {
      if (tx.type === ExpenseType.EXPENSE) {
        const cat = tx.category || 'OTHER';
        totals[cat] = (totals[cat] || 0) + tx.amount;
      }
    }
    return Object.entries(totals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const formattedIncome = formatTransactionAmount(
    income,
    ExpenseType.INCOME
  ).displayText;

  const formattedExpense = formatTransactionAmount(
    expense,
    ExpenseType.EXPENSE
  ).displayText;

  if (transactions.length === 0) {
    return (
      <Box sx={ContainerSx}>
        <Typography component='h3' sx={TitleSx}>
          {t('transactions.summary')}
        </Typography>
        <Box sx={EmptyStateSx}>
          <Typography variant='body2' sx={{ color: grey[500] }}>
            {t('overview.noTransactions')}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={ContainerSx}>
      <Typography component='h3' sx={TitleSx}>
        {t('transactions.summary')}
      </Typography>

      {/* Totals */}
      <Box sx={TotalsSx}>
        <Box sx={TotalRowSx}>
          <Typography variant='body2' sx={{ color: grey[600] }}>
            {t('transactions.totalIncome')}
          </Typography>
          <Typography variant='body2' sx={{ fontWeight: 600, color: 'green' }}>
            {formattedIncome}
          </Typography>
        </Box>
        <Box sx={TotalRowSx}>
          <Typography variant='body2' sx={{ color: grey[600] }}>
            {t('transactions.totalExpense')}
          </Typography>
          <Typography variant='body2' sx={{ fontWeight: 600, color: 'red' }}>
            {formattedExpense}
          </Typography>
        </Box>
        <Box sx={DividerSx} />
        <Box sx={TotalRowSx}>
          <Typography variant='body2' sx={{ fontWeight: 700 }}>
            {t('transactions.net')}
          </Typography>
          <Typography
            variant='body2'
            sx={{ fontWeight: 700, color: total >= 0 ? 'green' : 'red' }}
          >
            {total >= 0 ? '+' : '-'}
            {Math.abs(total).toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
            {t('transactions.byCategory')}
          </Typography>
          {categoryBreakdown.map(({ category, amount }) => (
            <Box key={category} sx={CategoryRowSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    ...ColorDotSx,
                    backgroundColor:
                      CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER,
                  }}
                />
                <Typography variant='body2'>
                  {t(`categories.${category}`)}
                </Typography>
              </Box>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                {
                  formatTransactionAmount(amount, ExpenseType.EXPENSE)
                    .displayText
                }
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

// Styles
const ContainerSx: SxProps = {
  width: { xs: '100%', md: 300 },
  minHeight: 200,
  background: 'white',
  border: `solid 1px ${grey[200]}`,
  borderRadius: 2,
  p: 2,
  display: 'flex',
  flexDirection: 'column',
};

const TitleSx: SxProps = {
  mb: 1.5,
  color: grey[600],
};

const EmptyStateSx: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
};

const TotalsSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

const TotalRowSx: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const DividerSx: SxProps = {
  borderTop: `1px solid ${grey[300]}`,
  my: 0.5,
};

const CategoryRowSx: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  py: 0.5,
};

const ColorDotSx: SxProps = {
  width: 10,
  height: 10,
  borderRadius: '50%',
};
