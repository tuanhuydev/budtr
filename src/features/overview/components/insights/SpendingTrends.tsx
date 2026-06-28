import { Box, SxProps, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { LineChart } from '@mui/x-charts/LineChart';
import { useMemo } from 'react';

import { CATEGORY_COLORS } from '@/configs/constants';
import { useSpendingTrends } from '@/hooks/api/useCharts';
import { useBudtrTranslation } from '@/hooks/useI18n';

import { ChartErrorBoundary } from './ChartErrorBoundary';
import { ChartSkeleton } from './ChartSkeleton';

const SpendingTrendsInner = () => {
  const { t } = useBudtrTranslation();
  const { data, isLoading } = useSpendingTrends();

  const { series, xLabels } = useMemo(() => {
    if (!data || !data.months?.length) return { series: [], xLabels: [] };

    const pivoted = data.months.map(month => {
      const entry: Record<string, number> = { month: 0 };
      data.data
        .filter(d => d.month === month)
        .forEach(d => {
          entry[d.category] = d.amount;
        });
      return entry;
    });

    const chartSeries = data.categories.map(cat => ({
      label: t(`categories.${cat}`),
      data: pivoted.map(p => p[cat] ?? 0),
      color: CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.OTHER,
      showMark: false,
    }));

    return { series: chartSeries, xLabels: data.months };
  }, [data, t]);

  if (isLoading) return <ChartSkeleton width={{ xs: '100%', md: 560 }} />;

  if (!data || !data.months?.length) {
    return (
      <Box sx={ContainerSx}>
        <Typography variant='body2' sx={TitleSx}>
          {t('insights.spendingTrends')}
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
        {t('insights.spendingTrends')}
      </Typography>
      <LineChart
        xAxis={[{ data: xLabels, scaleType: 'band' }]}
        series={series}
        height={250}
        margin={{ left: 50, right: 20, top: 10, bottom: 10 }}
        sx={{ width: '100%' }}
        slotProps={{
          legend: {
            direction: 'horizontal',
            position: { vertical: 'bottom', horizontal: 'center' },
          },
        }}
      />
    </Box>
  );
};

export const SpendingTrends = () => (
  <ChartErrorBoundary>
    <SpendingTrendsInner />
  </ChartErrorBoundary>
);

// Styles
const ContainerSx: SxProps = {
  width: { xs: '100%', md: 560 },
  height: 400,
  background: 'white',
  border: `solid 1px ${grey[200]}`,
  borderRadius: 2,
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const TitleSx: SxProps = {
  fontWeight: 600,
  mb: 1,
};

const EmptyStateSx: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 200,
};
