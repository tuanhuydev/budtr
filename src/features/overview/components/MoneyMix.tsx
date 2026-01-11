import { Box, SxProps, Typography, Chip, Popover } from '@mui/material';
import { grey } from '@mui/material/colors';
import { DefaultizedPieValueType } from '@mui/x-charts/models';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from 'date-fns';
import { useMemo, useState } from 'react';

import { DateRangePicker, DateRange } from '@/components/DateRangePicker';
import { useExpenses } from '@/hooks/api/useExpenses';
import { ExpenseType } from '@/types/expense';
import { formatExpenseAmount } from '@/utils/expenseFormatter';

import { CATEGORY_COLORS } from '../../../configs/constants';
import { useBudtrTranslation } from '../../../hooks/useI18n';

export type TimePeriod = 'today' | 'week' | 'month' | 'year' | 'custom';

const sizing = {
  width: 250,
  height: 250,
  hideLegend: true,
};

export const MoneyMix = () => {
  const { t } = useBudtrTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('today');
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [datePickerAnchor, setDatePickerAnchor] = useState<null | HTMLElement>(
    null
  );

  const periodOptions = [
    { value: 'today' as TimePeriod, labelKey: 'overview.today' },
    { value: 'week' as TimePeriod, labelKey: 'overview.thisWeek' },
    { value: 'month' as TimePeriod, labelKey: 'overview.thisMonth' },
    { value: 'year' as TimePeriod, labelKey: 'overview.thisYear' },
    {
      value: 'custom' as TimePeriod,
      labelKey: 'overview.custom',
      id: 'custom-period-button',
    },
  ];

  const getDateRange = (period: TimePeriod): { start: Date; end: Date } => {
    const now = new Date();
    switch (period) {
      case 'today':
        return { start: startOfDay(now), end: endOfDay(now) };
      case 'week':
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'year':
        return { start: startOfYear(now), end: endOfYear(now) };
      case 'custom':
        return {
          start: customDateRange.startDate || startOfDay(now),
          end: customDateRange.endDate || endOfDay(now),
        };
      default:
        return { start: startOfDay(now), end: endOfDay(now) };
    }
  };

  const { start, end } = getDateRange(selectedPeriod);

  const { data: expensesData } = useExpenses({
    startDate: start,
    endDate: end,
  });

  const expenses = expensesData?.expenses ?? [];

  const titleKey = useMemo(() => {
    switch (selectedPeriod) {
      case 'today':
        return 'overview.todayMoneyMix';
      case 'week':
        return 'overview.weekMoneyMix';
      case 'month':
        return 'overview.monthMoneyMix';
      case 'year':
        return 'overview.yearMoneyMix';
      case 'custom':
        return 'overview.customMoneyMix';
      default:
        return 'overview.todayMoneyMix';
    }
  }, [selectedPeriod]);

  const chartData = useMemo(() => {
    // Group expenses by category and sum amounts
    const categoryTotals = expenses.reduce(
      (acc, expense) => {
        const category = expense.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += expense.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    // Convert to chart data format
    return Object.entries(categoryTotals).map(([category, value]) => ({
      label: category ? t(`categories.${category}`) : t('categories.OTHER'),
      formattedValue: formatExpenseAmount(value, ExpenseType.EXPENSE)
        .displayText,
      value,
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER,
    }));
  }, [expenses, t]);

  const handlePeriodChange = (period: TimePeriod) => {
    if (period === 'custom') {
      // Open date picker
      setDatePickerAnchor(document.getElementById('custom-period-button'));
    } else {
      setSelectedPeriod(period);
    }
  };

  const handleCustomDateRangeChange = (newDateRange: DateRange) => {
    setCustomDateRange(newDateRange);
    if (newDateRange.startDate && newDateRange.endDate) {
      setSelectedPeriod('custom');
      setDatePickerAnchor(null);
    }
  };

  const handleCloseDatePicker = () => {
    setDatePickerAnchor(null);
  };

  const total = useMemo(
    () => chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData]
  );

  const formattedTotal = useMemo(
    () => formatExpenseAmount(total, ExpenseType.EXPENSE).displayText,
    [total]
  );

  const getArcLabel = (params: DefaultizedPieValueType) => {
    if (total === 0) return '0%';
    const percent = params.value / total;
    return `${(percent * 100).toFixed(0)}%`;
  };

  const periodFilterSection = (
    <>
      {/* Period Filter Buttons */}
      <Box sx={FilterButtonsSx}>
        {periodOptions.map(option => (
          <Chip
            key={option.value}
            id={option.id}
            label={t(option.labelKey)}
            onClick={() => handlePeriodChange(option.value)}
            color={selectedPeriod === option.value ? 'primary' : 'default'}
            size='small'
          />
        ))}
      </Box>

      {/* Date Range Picker Popover */}
      <Popover
        open={Boolean(datePickerAnchor)}
        anchorEl={datePickerAnchor}
        onClose={handleCloseDatePicker}
        anchorOrigin={PopoverAnchorOriginSx}
      >
        <Box sx={{ p: 2 }}>
          <DateRangePicker
            value={customDateRange}
            onChange={handleCustomDateRangeChange}
          />
        </Box>
      </Popover>
    </>
  );

  if (chartData.length === 0) {
    return (
      <Box sx={ContainerSx}>
        <Typography component={'h3'} sx={{ mb: 1.5, color: grey[600] }}>
          {t(titleKey)}
        </Typography>

        {periodFilterSection}

        <Box sx={EmptyStateSx}>
          <Typography variant='body2' sx={{ color: grey[500] }}>
            {t('overview.noExpenses')}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={ContainerSx}>
      <Typography component={'h3'} sx={{ mb: 1.5, color: grey[600] }}>
        {t(titleKey)}
      </Typography>

      {periodFilterSection}

      <Box sx={ChartContainerSx}>
        <PieChart
          series={[
            {
              innerRadius: 60,
              outerRadius: 100,
              valueFormatter: item => {
                const dataItem = chartData.find(d => d.value === item.value);
                return dataItem?.formattedValue || '';
              },
              data: chartData,
              arcLabel: getArcLabel,
            },
          ]}
          sx={PieChartSx}
          {...sizing}
        />
        {/* Total in center */}
        <Box sx={CenterTotalSx}>
          <Typography
            variant='h6'
            sx={{ fontWeight: 'bold', color: grey[800] }}
          >
            {formattedTotal}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Styles
const ContainerSx: SxProps = {
  width: { xs: '100%', md: 300 },
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
  height: 250,
};

const FilterButtonsSx: SxProps = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 0.5,
  mb: 2,
};

const PopoverAnchorOriginSx = {
  vertical: 'bottom',
  horizontal: 'left',
} as const;

const ChartContainerSx: SxProps = {
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
};

const PieChartSx: SxProps = {
  [`& .${pieArcLabelClasses.root}`]: {
    fill: 'white',
    fontSize: 14,
  },
};

const CenterTotalSx: SxProps = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
};
