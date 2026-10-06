import { Chip } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';

import { ChartLegend } from '@/components/ui/ChartLegend';
import { WidgetCard } from '@/components/ui/WidgetCard';
import {
  CHART_HEIGHT,
  bandXAxis,
  chartSx,
  fullAmount,
  moneyYAxis,
} from '@/configs/chartTheme';
import { neutral } from '@/configs/theme';
import { useSavingsProgress } from '@/hooks/api/useCharts';
import { useBudtrTranslation } from '@/hooks/useI18n';

const SavingsProgressInner = () => {
  const { t } = useBudtrTranslation();
  const { data, isLoading } = useSavingsProgress();

  const { series, xLabels } = useMemo(() => {
    if (!data?.data.length) return { series: [], xLabels: [] as string[] };
    return {
      xLabels: data.data.map(d => d.month),
      series: [
        {
          id: 'income',
          label: t('transactions.INCOME'),
          data: data.data.map(d => d.income),
          color: '#16A34A',
        },
        {
          id: 'expense',
          label: t('transactions.EXPENSE'),
          data: data.data.map(d => d.expenses),
          color: '#DC2626',
        },
        {
          id: 'savings',
          label: t('insights.savings'),
          data: data.data.map(d => d.savings),
          color: '#2563EB',
        },
      ].map(s => ({ ...s, valueFormatter: fullAmount })),
    };
  }, [data, t]);

  const rate = data?.projectedSavingsRate;

  return (
    <WidgetCard
      title={t('insights.savingsProgress')}
      loading={isLoading}
      empty={!data?.data.length ? t('overview.noData') : undefined}
      action={
        rate !== undefined ? (
          <Chip
            size='small'
            label={`${t('insights.projected')} ${rate.toFixed(1)}%`}
            sx={{ bgcolor: neutral[100], color: 'text.primary' }}
          />
        ) : undefined
      }
    >
      <BarChart
        xAxis={[bandXAxis(xLabels)]}
        yAxis={[moneyYAxis]}
        series={series}
        height={CHART_HEIGHT}
        borderRadius={4}
        grid={{ horizontal: true }}
        hideLegend
        sx={chartSx}
      />
      <ChartLegend
        items={series.map(s => ({
          id: s.id,
          label: s.label,
          color: s.color,
          shape: 'square',
        }))}
      />
    </WidgetCard>
  );
};

export const SavingsProgress = () => <SavingsProgressInner />;
