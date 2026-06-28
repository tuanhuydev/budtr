import { Box, SxProps, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';

import { useStats } from '@/hooks/api/useStats';
import { useBudtrTranslation } from '@/hooks/useI18n';
import { ExpenseType } from '@/types/common';
import {
  formatChartValue,
  formatTransactionAmount,
} from '@/utils/transactionFormatter';

export const CurrentWeekTransactions = () => {
  const { t } = useBudtrTranslation();
  const { data: stats } = useStats();

  const currentWeek = stats?.currentWeek || [];

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
        <Typography variant='body2' sx={TitleSx}>
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
      <Typography component='h3' sx={TitleSx}>
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
              valueFormatter: formatChartValue,
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
          borderRadius={4}
          width={380}
          height={320}
          margin={{ left: 30, right: 30, top: 10, bottom: 50 }}
        />
      </Box>
    </Box>
  );
};

// Styles
const TitleSx: SxProps = {
  fontWeight: 600,
  mb: 1,
};

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
