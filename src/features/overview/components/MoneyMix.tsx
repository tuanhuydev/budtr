import { Box, Chip, Popover, SxProps, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useMemo, useState } from 'react';

import { DateRangePicker, DateRange } from '@/components/DateRangePicker';
import { ChartLegend } from '@/components/ui/ChartLegend';
import { WidgetCard } from '@/components/ui/WidgetCard';
import { tabularNums, TOUCH } from '@/configs/theme';
import { useTransactions } from '@/hooks/api/useTransactions';
import { ExpenseType } from '@/types/transaction';
import { Period, getPeriodRange } from '@/utils/period';
import { formatTransactionAmount } from '@/utils/transactionFormatter';

import { CATEGORY_COLORS } from '../../../configs/constants';
import { useBudtrTranslation } from '../../../hooks/useI18n';

export type TimePeriod = Period;

interface MoneyMixProps {
  today: Date;
}

const PERIOD_OPTIONS: Array<{ value: TimePeriod; labelKey: string }> = [
  { value: 'today', labelKey: 'overview.today' },
  { value: 'week', labelKey: 'overview.thisWeek' },
  { value: 'month', labelKey: 'overview.thisMonth' },
  { value: 'year', labelKey: 'overview.thisYear' },
  { value: 'custom', labelKey: 'overview.custom' },
];

export const MoneyMix = ({ today }: MoneyMixProps) => {
  const { t } = useBudtrTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('today');
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const { start, end } = getPeriodRange(selectedPeriod, today, customDateRange);
  const { data: transactionsData, isLoading } = useTransactions({
    startDate: start,
    endDate: end,
  });

  const chartData = useMemo(() => {
    const expenses =
      transactionsData?.transactions.filter(
        tx => tx.type === ExpenseType.EXPENSE
      ) ?? [];
    const totals = expenses.reduce(
      (acc, tx) => {
        acc[tx.category] = (acc[tx.category] ?? 0) + tx.amount;
        return acc;
      },
      {} as Record<string, number>
    );
    return Object.entries(totals).map(([category, value]) => ({
      id: category,
      label: category ? t(`categories.${category}`) : t('categories.OTHER'),
      value,
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER,
    }));
  }, [transactionsData, t]);

  const total = useMemo(
    () => chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData]
  );

  const handleCustomChange = (range: DateRange) => {
    setCustomDateRange(range);
    if (range.startDate && range.endDate) {
      setSelectedPeriod('custom');
      setAnchor(null);
    }
  };

  const legendItems = chartData.map(item => ({
    id: item.id,
    label: `${item.label} ${total ? ((item.value / total) * 100).toFixed(1) : 0}%`,
    color: item.color,
  }));

  const action = (
    <>
      {PERIOD_OPTIONS.map(option => {
        const active = selectedPeriod === option.value;
        return (
          <Chip
            key={option.value}
            component='button'
            size='small'
            clickable
            aria-pressed={active}
            label={t(option.labelKey)}
            variant={active ? 'filled' : 'outlined'}
            color={active ? 'primary' : 'default'}
            onClick={e =>
              option.value === 'custom'
                ? setAnchor(e.currentTarget)
                : setSelectedPeriod(option.value)
            }
          />
        );
      })}
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2 }}>
          <DateRangePicker
            value={customDateRange}
            onChange={handleCustomChange}
          />
        </Box>
      </Popover>
    </>
  );

  return (
    <WidgetCard
      title={t('overview.todayMoneyMix')}
      action={action}
      loading={isLoading}
      empty={chartData.length === 0 ? t('overview.noTransactions') : undefined}
    >
      <Box sx={ChartContainerSx} aria-label={t('overview.todayMoneyMix')}>
        <Box sx={DonutSx}>
          <PieChart
            series={[
              {
                data: chartData,
                innerRadius: 60,
                outerRadius: 84,
                paddingAngle: 2,
                cornerRadius: 3,
                valueFormatter: item =>
                  formatTransactionAmount(item.value, ExpenseType.EXPENSE)
                    .displayText,
              },
            ]}
            width={180}
            height={180}
            hideLegend
          />
          <Box sx={CenterTotalSx}>
            <Typography variant='caption' color='text.secondary'>
              {t('overview.total')}
            </Typography>
            <Typography sx={TotalSx}>{total.toLocaleString()}</Typography>
          </Box>
        </Box>
        <ChartLegend items={legendItems} centered />
      </Box>
    </WidgetCard>
  );
};

// Styles
const ChartContainerSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const DonutSx: SxProps = {
  position: 'relative',
  width: 180,
  height: 180,
};

const CenterTotalSx: SxProps = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  pointerEvents: 'none',
};

const TotalSx: SxProps = {
  fontSize: 20,
  lineHeight: '28px',
  fontWeight: 700,
  ...tabularNums,
  [TOUCH]: { fontSize: 22, lineHeight: '30px' },
};
