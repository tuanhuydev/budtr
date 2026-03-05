import { Box, SxProps, CircularProgress } from '@mui/material';
import { startOfDay, endOfDay } from 'date-fns';

import { useBudgets } from '../../hooks/api/useBudgets';
import { useTransactions } from '../../hooks/api/useTransactions';

import { CurrentWeekTransactions } from './components/CurrentWeekTransactions';
import { DailySpendContainer } from './components/DailySpendContainer';
import { MoneyMix } from './components/MoneyMix';
import { TopTransactions } from './components/TopTransactions';
import { WeeklyComparison } from './components/WeeklyComparison';

export const OverviewLanding = () => {
  const today = new Date();

  // Fetch daily transactions for DailySpendContainer
  const { data: dailyTransactions, isLoading: dailyTransactionsLoading } =
    useTransactions({
      startDate: startOfDay(today),
      endDate: endOfDay(today),
    });

  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets();

  const transactions = dailyTransactions?.expenses ?? [];

  if (dailyTransactionsLoading || budgetsLoading) {
    return (
      <Box sx={LoadingContainerSx}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={RootContainerSx}>
      <Box sx={LeftColumnSx}>
        <DailySpendContainer transactions={transactions} budgets={budgets} />
      </Box>
      <Box sx={RightColumnSx}>
        <MoneyMix />
        <WeeklyComparison />
        <CurrentWeekTransactions />
        <TopTransactions />
      </Box>
    </Box>
  );
};

// Styles
const LoadingContainerSx: SxProps = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const RootContainerSx: SxProps = {
  width: '100%',
  height: '100%',
  overflow: 'auto',
  display: 'flex',
  gap: 2,
  alignItems: 'flex-start',
  flexDirection: { xs: 'column', md: 'row' },
};

const LeftColumnSx: SxProps = {
  flex: { xs: '1 1 100%', md: '0 0 auto' },
  width: { xs: '100%', md: 'auto' },
};

const RightColumnSx: SxProps = {
  flex: { xs: '1 1 100%', md: '1 1 auto' },
  width: { xs: '100%', md: 'auto' },
  display: 'flex',
  gap: 2,
  flexWrap: 'wrap',
  alignItems: 'flex-start',
};
