import { SxProps, Theme, alpha } from '@mui/material/styles';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';

import { formatChartValue } from '@/utils/transactionFormatter';

export const CHART_HEIGHT = 230;

// Light gridlines, muted 12px labels, only the x baseline stays visible.
export const chartSx: SxProps<Theme> = theme => ({
  width: '100%',
  [`& .${axisClasses.tickLabel}`]: {
    fill: theme.palette.text.secondary,
    fontSize: 12,
    '@media (max-width: 899.95px)': { fontSize: 13 },
  },
  [`& .${axisClasses.bottom} .${axisClasses.line}`]: {
    stroke: theme.palette.divider,
  },
  [`& .${chartsGridClasses.line}`]: {
    stroke: alpha(theme.palette.divider, 0.6),
  },
});

export const moneyYAxis = {
  valueFormatter: formatChartValue,
  disableLine: true,
  disableTicks: true,
  tickNumber: 4,
  width: 48,
};

export const moneyYAxisFromZero = { ...moneyYAxis, min: 0 };

export const bandXAxis = (data: string[]) => ({
  scaleType: 'band' as const,
  data,
  disableTicks: true,
  categoryGapRatio: 0.35,
  barGapRatio: 0.1,
});

export const fullAmount = (value: number | null) =>
  value == null ? '' : value.toLocaleString();
