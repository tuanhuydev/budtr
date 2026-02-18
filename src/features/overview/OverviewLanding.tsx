import { Box, SxProps, CircularProgress } from '@mui/material';
import { startOfDay, endOfDay } from 'date-fns';

import { useBudgets } from '../../hooks/api/useBudgets';
import { useExpenses } from '../../hooks/api/useExpenses';

import { CurrentWeekExpenses } from './components/CurrentWeekExpenses';
import { DailySpendContainer } from './components/DailySpendContainer';
import { MoneyMix } from './components/MoneyMix';
import { TopExpenses } from './components/TopExpenses';
import { WeeklyComparison } from './components/WeeklyComparison';

export const OverviewLanding = () => {
  const today = new Date();

  // Fetch daily expenses for DailySpendContainer
  const { data: dailyExpenses, isLoading: dailyExpensesLoading } = useExpenses({
    startDate: startOfDay(today),
    endDate: endOfDay(today),
  });

  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets();

  const expenses = dailyExpenses?.expenses ?? [];

  if (dailyExpensesLoading || budgetsLoading) {
    return (
      <Box sx={LoadingContainerSx}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={RootContainerSx}>
      <Box sx={LeftColumnSx}>
        <DailySpendContainer expenses={expenses} budgets={budgets} />
      </Box>
      <Box sx={RightColumnSx}>
        <MoneyMix />
        <WeeklyComparison />
        <CurrentWeekExpenses />
        <TopExpenses />
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
