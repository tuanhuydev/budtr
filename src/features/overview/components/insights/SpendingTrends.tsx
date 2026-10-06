import { Box, Chip, SxProps } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useMemo, useState } from 'react';

import { WidgetCard } from '@/components/ui/WidgetCard';
import {
  CHART_HEIGHT,
  chartSx,
  fullAmount,
  moneyYAxisFromZero,
} from '@/configs/chartTheme';
import { CATEGORY_COLORS } from '@/configs/constants';
import { neutral } from '@/configs/theme';
import { useSpendingTrends } from '@/hooks/api/useCharts';
import { useBudtrTranslation } from '@/hooks/useI18n';

const colorOf = (cat: string) => CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.OTHER;

const SpendingTrendsInner = () => {
  const { t } = useBudtrTranslation();
  const { data, isLoading } = useSpendingTrends();
  // Empty selection means "All".
  const [selected, setSelected] = useState<string[]>([]);

  const { valuesByCat, xLabels, categories, yMax } = useMemo(() => {
    if (!data?.months?.length) {
      return {
        valuesByCat: {} as Record<string, number[]>,
        xLabels: [] as string[],
        categories: [] as string[],
        yMax: undefined,
      };
    }
    const values: Record<string, number[]> = {};
    data.categories.forEach(cat => {
      values[cat] = data.months.map(
        month =>
          data.data.find(d => d.month === month && d.category === cat)
            ?.amount ?? 0
      );
    });
    const max = Math.max(0, ...Object.values(values).flat());
    return {
      valuesByCat: values,
      xLabels: data.months,
      categories: data.categories,
      yMax: max > 0 ? max : undefined,
    };
  }, [data]);

  const allActive = selected.length === 0;
  const visible = allActive
    ? categories
    : categories.filter(c => selected.includes(c));

  const toggle = (cat: string) =>
    setSelected(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const caption = allActive
    ? t('overview.showingAll')
    : `${t('overview.showing')} ${visible
        .map(c => t(`categories.${c}`))
        .join(', ')}`;

  const pills = (
    <Box role='group' aria-label={t('insights.spendingTrends')} sx={PillsSx}>
      <Chip
        component='button'
        size='small'
        clickable
        aria-pressed={allActive}
        label={t('overview.all')}
        variant={allActive ? 'filled' : 'outlined'}
        color={allActive ? 'primary' : 'default'}
        onClick={() => setSelected([])}
        sx={
          allActive
            ? undefined
            : { bgcolor: neutral[100], color: neutral[600], border: 0 }
        }
      />
      {categories.map(cat => {
        const picked = selected.includes(cat);
        return (
          <Chip
            key={cat}
            component='button'
            size='small'
            clickable
            aria-pressed={picked}
            label={t(`categories.${cat}`)}
            variant={picked ? 'filled' : 'outlined'}
            color={picked ? 'primary' : 'default'}
            onClick={() => toggle(cat)}
            icon={
              <Box
                sx={{
                  ...DotSx,
                  bgcolor: colorOf(cat),
                  boxShadow: picked ? '0 0 0 2px #fff' : 'none',
                }}
              />
            }
          />
        );
      })}
    </Box>
  );

  return (
    <WidgetCard
      title={t('insights.spendingTrends')}
      subtitle={data?.months?.length ? caption : undefined}
      loading={isLoading}
      empty={!data?.months?.length ? t('overview.noData') : undefined}
    >
      {pills}
      <LineChart
        xAxis={[{ scaleType: 'point', data: xLabels }]}
        yAxis={[{ ...moneyYAxisFromZero, max: yMax }]}
        series={visible.map(cat => ({
          id: cat,
          label: t(`categories.${cat}`),
          data: valuesByCat[cat],
          color: colorOf(cat),
          showMark: false,
          curve: 'linear',
          valueFormatter: fullAmount,
        }))}
        height={CHART_HEIGHT}
        grid={{ horizontal: true }}
        margin={{ right: 24 }}
        hideLegend
        sx={chartSx}
      />
    </WidgetCard>
  );
};

export const SpendingTrends = () => <SpendingTrendsInner />;

// Styles
const PillsSx: SxProps = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 1,
  mb: 2,
};

const DotSx: SxProps = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  ml: '8px !important',
  mr: '-2px !important',
};
