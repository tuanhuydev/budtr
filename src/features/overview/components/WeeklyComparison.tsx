import { Box, SxProps, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';

import { CATEGORY_COLORS } from '@/configs/constants';
import { useStats, WeeklyComparisonItem } from '@/hooks/api/useStats';
import { useBudtrTranslation } from '@/hooks/useI18n';
import { ExpenseType } from '@/types/common';
import { formatTransactionAmount } from '@/utils/transactionFormatter';

export const WeeklyComparison = () => {
  const { t } = useBudtrTranslation();
  const { data: stats } = useStats();

  const weeklyComparison: WeeklyComparisonItem[] =
    stats?.weeklyComparison || [];

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

  const { chartSeries, xAxisData } = useMemo(() => {
    if (!weeklyComparison || weeklyComparison.length === 0) {
      return { categories: [], chartSeries: [], xAxisData: [] };
    }

    // Extract all categories from the data (excluding 'label' field)
    const categoriesSet = new Set<string>();
    weeklyComparison.forEach(week => {
      Object.keys(week).forEach(key => {
        if (key !== 'label') {
          categoriesSet.add(key);
        }
      });
    });

    const cats = Array.from(categoriesSet);

    // Extract x-axis labels (previousWeek, currentWeek)
    const xData = weeklyComparison.map(week => t(`overview.${week.label}`));

    // Create series for each category
    const series = cats.map(category => ({
      label: t(`categories.${category}`),
      data: weeklyComparison.map(week => (week[category] as number) || 0),
      stack: 'total',
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER,
      valueFormatter: (value: number | null) =>
        value
          ? formatTransactionAmount(value, ExpenseType.EXPENSE).displayText
          : '',
    }));

    return {
      categories: cats,
      chartSeries: series,
      xAxisData: xData,
    };
  }, [weeklyComparison, t]);

  if (!weeklyComparison || weeklyComparison.length === 0) {
    return (
      <Box sx={ContainerSx}>
        <Typography component={'h3'} sx={{ mb: 1.5, color: grey[600] }}>
          {t('overview.weeklyComparison')}
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
        {t('overview.weeklyComparison')}
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
          series={chartSeries}
          width={280}
          height={320}
          margin={{ left: 20, right: 20, top: 10, bottom: 50 }}
        />
      </Box>
    </Box>
  );
};

// Styles
const ContainerSx: SxProps = {
  width: { xs: '100%', md: 300 },
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
