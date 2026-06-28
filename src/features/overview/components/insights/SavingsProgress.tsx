import { Box, Chip, SxProps, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';

import { useSavingsProgress } from '@/hooks/api/useCharts';
import { useBudtrTranslation } from '@/hooks/useI18n';

import { ChartErrorBoundary } from './ChartErrorBoundary';
import { ChartSkeleton } from './ChartSkeleton';

const INCOME_COLOR = '#22c55e';
const EXPENSE_COLOR = '#ef4444';
const SAVINGS_COLOR = '#3b82f6';

const SavingsProgressInner = () => {
  const { t } = useBudtrTranslation();
  const { data, isLoading } = useSavingsProgress();

  const { series, xLabels } = useMemo(() => {
    if (!data?.data.length) return { series: [], xLabels: [] };

    const months = data.data.map(d => d.month);

    const chartSeries = [
      {
        label: t('transactions.INCOME'),
        data: data.data.map(d => d.income),
        color: INCOME_COLOR,
      },
      {
        label: t('transactions.EXPENSE'),
        data: data.data.map(d => d.expenses),
        color: EXPENSE_COLOR,
      },
      {
        label: t('insights.savings'),
        data: data.data.map(d => d.savings),
        color: SAVINGS_COLOR,
      },
    ];

    return { series: chartSeries, xLabels: months };
  }, [data, t]);

  if (isLoading) return <ChartSkeleton width={{ xs: '100%', md: 560 }} />;

  if (!data?.data.length) {
    return (
      <Box sx={ContainerSx}>
        <Typography component='h3' sx={TitleSx}>
          {t('insights.savingsProgress')}
        </Typography>
        <Box sx={EmptyStateSx}>
          <Typography variant='body2' sx={{ color: grey[500] }}>
            {t('overview.noData')}
          </Typography>
        </Box>
      </Box>
    );
  }

  const projectedRate = data.projectedSavingsRate;

  return (
    <Box sx={ContainerSx}>
      <Box sx={HeaderRowSx}>
        <Typography component='h3' sx={TitleSx}>
          {t('insights.savingsProgress')}
        </Typography>
        <Chip
          size='small'
          label={`${t('insights.projected')} ${projectedRate.toFixed(1)}%`}
          sx={{
            bgcolor: projectedRate >= 0 ? '#dcfce7' : '#fee2e2',
            color: projectedRate >= 0 ? '#15803d' : '#b91c1c',
            fontWeight: 600,
            fontSize: '0.72rem',
          }}
        />
      </Box>

      <BarChart
        xAxis={[{ scaleType: 'band', data: xLabels }]}
        yAxis={[
          {
            valueFormatter: (v: number) => {
              const abs = Math.abs(v);
              if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
              if (abs >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
              return String(v);
            },
          },
        ]}
        series={series}
        height={250}
        margin={{ left: 55, right: 20, top: 10, bottom: 10 }}
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

export const SavingsProgress = () => (
  <ChartErrorBoundary>
    <SavingsProgressInner />
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

const HeaderRowSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb: 1,
};

const TitleSx: SxProps = {
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
