import { Box, SxProps, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';

import { useStats } from '@/hooks/api/useStats';
import { useBudtrTranslation } from '@/hooks/useI18n';
import { ExpenseType } from '@/types/common';
import { formatTransactionAmount } from '@/utils/transactionFormatter';

export const CurrentWeekTransactions = () => {
  const { t } = useBudtrTranslation();
  const { data: stats } = useStats();

  const currentWeek = stats?.currentWeek || [];

  // Format large numbers to human-readable format
  const formatYAxisValue = (value: number): string => {
    const absValue = Math.abs(value);
    if (absValue >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (absValue >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (absValue >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }
    return value.toFixed(0);
  };

  const { chartData, xAxisData } = useMemo(() => {
    if (!currentWeek || currentWeek.length === 0) {
      return { chartData: [], xAxisData: [] };
    }

    const xData = currentWeek.map(day => t(`days.${day.day}`));
    const data = currentWeek.map(day => day.amount);

    return {
      chartData: data,
      xAxisData: xData,
    };
  }, [currentWeek, t]);

  if (!currentWeek || currentWeek.length === 0) {
    return (
      <Box sx={ContainerSx}>
        <Typography component={'h3'} sx={{ mb: 1.5, color: grey[600] }}>
          {t('overview.currentWeekTransactions')}
        </Typography>

        <Box sx={EmptyStateSx}>
          <Typography variant='body2' sx={{ color: grey[500] }}>
            {t('overview.noData')}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={ContainerSx}>
      <Typography component={'h3'} sx={{ mb: 1.5, color: grey[600] }}>
        {t('overview.currentWeekTransactions')}
      </Typography>

      <Box sx={ChartContainerSx}>
        <BarChart
          xAxis={[
            {
              scaleType: 'band',
              data: xAxisData,
            },
          ]}
          yAxis={[
            {
              valueFormatter: formatYAxisValue,
            },
          ]}
          series={[
            {
              data: chartData,
              color: '#1976d2',
              valueFormatter: (value: number | null) =>
                value
                  ? formatTransactionAmount(value, ExpenseType.EXPENSE)
                      .displayText
                  : '',
            },
          ]}
          width={380}
          height={320}
          margin={{ left: 30, right: 30, top: 10, bottom: 50 }}
        />
      </Box>
    </Box>
  );
};

// Styles
const ContainerSx: SxProps = {
  width: { xs: '100%', md: 400 },
  height: 400,
  background: 'white',
  border: `solid 1px ${grey[200]}`,
  borderRadius: 2,
  p: 2,
  display: 'flex',
  flexDirection: 'column',
};

const EmptyStateSx: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 320,
};

const ChartContainerSx: SxProps = {
  display: 'flex',
  justifyContent: 'center',
};
