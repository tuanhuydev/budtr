import { Box, Chip, SxProps, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { LineChart } from '@mui/x-charts/LineChart';
import { useMemo, useState } from 'react';

import { CATEGORY_COLORS } from '@/configs/constants';
import { useSpendingTrends } from '@/hooks/api/useCharts';
import { useBudtrTranslation } from '@/hooks/useI18n';
import { formatChartValue } from '@/utils/transactionFormatter';

import { ChartErrorBoundary } from './ChartErrorBoundary';
import { ChartSkeleton } from './ChartSkeleton';

const SpendingTrendsInner = () => {
  const { t } = useBudtrTranslation();
  const { data, isLoading } = useSpendingTrends();
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(
    new Set()
  );

  const { series, xLabels, categories } = useMemo(() => {
    if (!data || !data.months?.length)
      return { series: [], xLabels: [], categories: [] };

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
      id: cat,
      label: t(`categories.${cat}`),
      data: pivoted.map(p =>
        hiddenCategories.has(cat) ? null : (p[cat] ?? 0)
      ),
      color: CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.OTHER,
      showMark: false,
    }));

    return {
      series: chartSeries,
      xLabels: data.months,
      categories: data.categories,
    };
  }, [data, t, hiddenCategories]);

  const toggleCategory = (cat: string) => {
    setHiddenCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

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
      <Box sx={LegendRowSx}>
        {categories.map(cat => {
          const color = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.OTHER;
          const isHidden = hiddenCategories.has(cat);
          return (
            <Chip
              key={cat}
              size='small'
              clickable
              onClick={() => toggleCategory(cat)}
              label={t(`categories.${cat}`)}
              sx={{
                borderColor: color,
                border: '1px solid',
                bgcolor: isHidden ? 'transparent' : `${color}1f`,
                color: isHidden ? grey[400] : 'text.primary',
                textDecoration: isHidden ? 'line-through' : 'none',
                fontWeight: 500,
              }}
            />
          );
        })}
      </Box>
      <LineChart
        xAxis={[{ data: xLabels, scaleType: 'band' }]}
        yAxis={[{ valueFormatter: formatChartValue }]}
        series={series}
        height={220}
        margin={{ left: 56, right: 20, top: 10, bottom: 10 }}
        sx={{ width: '100%' }}
        hideLegend
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

const LegendRowSx: SxProps = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 0.5,
  mb: 1,
  maxHeight: 76,
  overflowY: 'auto',
};

const EmptyStateSx: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 200,
};
