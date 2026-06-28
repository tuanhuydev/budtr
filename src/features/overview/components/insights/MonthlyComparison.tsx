import { Box, SxProps, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';

import { CATEGORY_COLORS } from '@/configs/constants';
import { useMonthlyComparison } from '@/hooks/api/useCharts';
import { useBudtrTranslation } from '@/hooks/useI18n';

import { ChartErrorBoundary } from './ChartErrorBoundary';
import { ChartSkeleton } from './ChartSkeleton';

const MonthlyComparisonInner = () => {
  const { t } = useBudtrTranslation();
  const { data, isLoading } = useMonthlyComparison();

  const { series, xLabels } = useMemo(() => {
    if (!data || !data.months?.length) return { series: [], xLabels: [] };

    const pivoted = data.months.map(month => {
      const entry: Record<string, number> = {};
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
      stack: undefined,
    }));

    return { series: chartSeries, xLabels: data.months };
  }, [data, t]);

  if (isLoading) return <ChartSkeleton width={{ xs: '100%', md: 560 }} />;

  if (!data || !data.months?.length) {
    return (
      <Box sx={ContainerSx}>
        <Typography component='h3' sx={TitleSx}>
          {t('insights.monthlyComparison')}
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
        {t('insights.monthlyComparison')}
      </Typography>
      <BarChart
        xAxis={[{ scaleType: 'band', data: xLabels }]}
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

export const MonthlyComparison = () => (
  <ChartErrorBoundary>
    <MonthlyComparisonInner />
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
  mb: 1,
  color: grey[600],
  fontWeight: 600,
  fontSize: '0.95rem',
};

const EmptyStateSx: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 200,
};
