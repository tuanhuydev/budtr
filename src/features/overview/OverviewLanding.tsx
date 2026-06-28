import { Box, SxProps, CircularProgress } from '@mui/material';
import { startOfDay, endOfDay, addDays } from 'date-fns';
import { useState, useEffect } from 'react';

import { useBudgets } from '../../hooks/api/useBudgets';
import { useTransactions } from '../../hooks/api/useTransactions';

import { CurrentWeekTransactions } from './components/CurrentWeekTransactions';
import { DailySpendContainer } from './components/DailySpendContainer';
import { CategoryBreakdown } from './components/insights/CategoryBreakdown';
import { MonthlyComparison } from './components/insights/MonthlyComparison';
import { SavingsProgress } from './components/insights/SavingsProgress';
import { SpendingTrends } from './components/insights/SpendingTrends';
import { MoneyMix } from './components/MoneyMix';
import { TopTransactions } from './components/TopTransactions';
import { WeeklyComparison } from './components/WeeklyComparison';

export const OverviewLanding = () => {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const now = new Date();
    const msUntilMidnight =
      startOfDay(addDays(now, 1)).getTime() - now.getTime();
    const id = setTimeout(() => setToday(new Date()), msUntilMidnight);
    return () => clearTimeout(id);
  }, [today]);

  // Fetch daily transactions for DailySpendContainer
  const { data: dailyTransactions, isLoading: dailyTransactionsLoading } =
    useTransactions({
      startDate: startOfDay(today),
      endDate: endOfDay(today),
    });

  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets();

  const transactions = dailyTransactions?.transactions ?? [];

  if (dailyTransactionsLoading || budgetsLoading) {
    return (
      <Box sx={LoadingContainerSx}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={RootContainerSx}>
      <DailySpendContainer transactions={transactions} budgets={budgets} />
      <MoneyMix today={today} />
      <WeeklyComparison />
      <CurrentWeekTransactions />
      <CategoryBreakdown />
      <SpendingTrends />
      <MonthlyComparison />
      <SavingsProgress />
      <TopTransactions />
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
  flexWrap: 'wrap',
  gap: 2,
  alignItems: 'flex-start',
  alignContent: 'flex-start',
};
