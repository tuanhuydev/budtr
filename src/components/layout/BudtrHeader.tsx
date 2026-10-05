import { Box, Paper, SxProps } from '@mui/material';
import { useState } from 'react';

import { DateRange } from '@/components/DateRangePicker';
import { usePeriodSummary } from '@/hooks/usePeriodSummary';
import { Period } from '@/utils/period';

import { BudtrTitle } from './BudtrTitle';
import { HeaderStats } from './HeaderStats';
import { PeriodPills } from './PeriodPills';

export const BudtrHeader = () => {
  const [today] = useState(() => new Date());
  const [period, setPeriod] = useState<Period>('week');
  const [customRange, setCustomRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const { summary, isLoading } = usePeriodSummary(period, today, customRange);

  return (
    <Paper variant='outlined' component='header' sx={RootSx}>
      <Box sx={TitleRowSx}>
        <BudtrTitle />
        <PeriodPills
          period={period}
          customRange={customRange}
          onPeriodChange={setPeriod}
          onCustomRangeChange={setCustomRange}
        />
      </Box>
      <HeaderStats summary={summary} loading={isLoading} />
    </Paper>
  );
};

// Styles
const RootSx: SxProps = {
  p: '28px 32px',
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const TitleRowSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 2,
  '@container (min-width: 960px)': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};
