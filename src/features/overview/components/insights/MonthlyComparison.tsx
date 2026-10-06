import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';

import { ChartLegend } from '@/components/ui/ChartLegend';
import { WidgetCard } from '@/components/ui/WidgetCard';
import {
  CHART_HEIGHT,
  bandXAxis,
  chartSx,
  fullAmount,
  moneyYAxisFromZero,
} from '@/configs/chartTheme';
import { CATEGORY_COLORS } from '@/configs/constants';
import { useMonthlyComparison } from '@/hooks/api/useCharts';
import { useBudtrTranslation } from '@/hooks/useI18n';

const MAX_CATEGORIES = 5;

const MonthlyComparisonInner = () => {
  const { t } = useBudtrTranslation();
  const { data, isLoading } = useMonthlyComparison();

  const { series, xLabels } = useMemo(() => {
    if (!data?.months?.length) return { series: [], xLabels: [] as string[] };

    const valueOf = (month: string, cat: string) =>
      data.data.find(d => d.month === month && d.category === cat)?.amount ?? 0;
    const totals = data.categories.map(cat => ({
      cat,
      total: data.months.reduce((sum, m) => sum + valueOf(m, cat), 0),
    }));
    const ranked = totals
      .filter(x => x.cat !== 'OTHER')
      .sort((a, b) => b.total - a.total)
      .map(x => x.cat);
    const top = ranked.slice(0, MAX_CATEGORIES);
    const rest = [
      ...ranked.slice(MAX_CATEGORIES),
      ...(data.categories.includes('OTHER') ? ['OTHER'] : []),
    ];

    const built = top.map(cat => ({
      id: cat,
      label: t(`categories.${cat}`),
      data: data.months.map(m => valueOf(m, cat)),
      color: CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.OTHER,
      valueFormatter: fullAmount,
    }));
    if (rest.length) {
      built.push({
        id: 'OTHER',
        label: t('categories.OTHER'),
        data: data.months.map(m =>
          rest.reduce((sum, cat) => sum + valueOf(m, cat), 0)
        ),
        color: CATEGORY_COLORS.OTHER,
        valueFormatter: fullAmount,
      });
    }
    return { series: built, xLabels: data.months };
  }, [data, t]);

  return (
    <WidgetCard
      title={t('insights.monthlyComparison')}
      loading={isLoading}
      empty={!data?.months?.length ? t('overview.noData') : undefined}
    >
      <BarChart
        xAxis={[bandXAxis(xLabels)]}
        yAxis={[moneyYAxisFromZero]}
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

export const MonthlyComparison = () => <MonthlyComparisonInner />;
