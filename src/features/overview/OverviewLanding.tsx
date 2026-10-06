import { Box, SxProps, CircularProgress } from '@mui/material';
import { startOfDay, endOfDay, addDays } from 'date-fns';
import { useState, useEffect } from 'react';

import { WidgetSurfaceContext } from '@/components/ui/WidgetSurfaceContext';

import { useAssets } from '../../hooks/api/useAssets';
import { useTransactions } from '../../hooks/api/useTransactions';

import { DailySpendContainer } from './components/DailySpendContainer';
import { CategoryBreakdown } from './components/insights/CategoryBreakdown';
import { MonthlyComparison } from './components/insights/MonthlyComparison';
import { SavingsProgress } from './components/insights/SavingsProgress';
import { SpendingTrends } from './components/insights/SpendingTrends';
import { MoneyMix } from './components/MoneyMix';
import { Row } from './components/Row';
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

  const { data: assets = [], isLoading: assetsLoading } = useAssets();

  const transactions = dailyTransactions?.transactions ?? [];

  return (
    <WidgetSurfaceContext.Provider value='flat'>
      <Box sx={GridSx}>
        <Row
          left={
            dailyTransactionsLoading || assetsLoading ? (
              <Box sx={LoadingContainerSx}>
                <CircularProgress />
              </Box>
            ) : (
              <DailySpendContainer
                transactions={transactions}
                assets={assets}
              />
            )
          }
          right={<MoneyMix today={today} />}
        />
        <Row left={<SpendingTrends />} right={<CategoryBreakdown />} />
        <Row left={<SavingsProgress />} right={<TopTransactions />} />
        <Row left={<MonthlyComparison />} right={<WeeklyComparison />} />
      </Box>
    </WidgetSurfaceContext.Provider>
  );
};

// Styles
const LoadingContainerSx: SxProps = {
  width: '100%',
  minHeight: 240,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const GridSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
  bgcolor: 'divider',
};
