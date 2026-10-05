import { Chip } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo, useState } from 'react';

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
import { useStats } from '@/hooks/api/useStats';
import { useBudtrTranslation } from '@/hooks/useI18n';

type Mode = 'day' | 'week';

export const WeeklyComparison = () => {
  const { t } = useBudtrTranslation();
  const { data: stats, isLoading } = useStats();
  const [mode, setMode] = useState<Mode>('day');

  const currentWeek = stats?.currentWeek;
  const weeklyComparison = stats?.weeklyComparison;

  const byDay = useMemo(
    () => ({
      xLabels: (currentWeek ?? []).map(d => t(`days.${d.day}`)),
      series: [
        {
          id: 'amount',
          label: t('overview.currentWeekTransactions'),
          data: (currentWeek ?? []).map(d => d.amount),
          color: '#172733',
          valueFormatter: fullAmount,
        },
      ],
    }),
    [currentWeek, t]
  );

  const vsLast = useMemo(() => {
    const weeks = weeklyComparison ?? [];
    const cats = Array.from(
      new Set(weeks.flatMap(w => Object.keys(w).filter(k => k !== 'label')))
    );
    return {
      xLabels: weeks.map(w => t(`overview.${w.label}`)),
      series: cats.map(cat => ({
        id: cat,
        label: t(`categories.${cat}`),
        data: weeks.map(w => (w[cat] as number) || 0),
        stack: 'total',
        color: CATEGORY_COLORS[cat] || CATEGORY_COLORS.OTHER,
        valueFormatter: fullAmount,
      })),
    };
  }, [weeklyComparison, t]);

  const active = mode === 'day' ? byDay : vsLast;
  const hasData = active.series.length > 0 && active.xLabels.length > 0;

  const action = (
    <>
      {(
        [
          ['day', 'overview.byDay'],
          ['week', 'overview.vsLastWeek'],
        ] as Array<[Mode, string]>
      ).map(([value, labelKey]) => (
        <Chip
          key={value}
          component='button'
          size='small'
          clickable
          aria-pressed={mode === value}
          label={t(labelKey)}
          variant={mode === value ? 'filled' : 'outlined'}
          color={mode === value ? 'primary' : 'default'}
          onClick={() => setMode(value)}
        />
      ))}
    </>
  );

  return (
    <WidgetCard
      title={t('overview.weeklyComparison')}
      action={action}
      loading={isLoading}
      empty={!hasData ? t('overview.noData') : undefined}
    >
      <BarChart
        xAxis={[bandXAxis(active.xLabels)]}
        yAxis={[moneyYAxisFromZero]}
        series={active.series}
        height={CHART_HEIGHT}
        borderRadius={4}
        grid={{ horizontal: true }}
        hideLegend
        sx={chartSx}
      />
      {mode === 'week' ? (
        <ChartLegend
          items={vsLast.series.map(s => ({
            id: s.id,
            label: s.label,
            color: s.color,
            shape: 'square',
          }))}
        />
      ) : null}
    </WidgetCard>
  );
};
