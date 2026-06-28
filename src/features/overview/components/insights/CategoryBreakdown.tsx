import { Box, SxProps, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { PieChart } from '@mui/x-charts/PieChart';
import { useMemo } from 'react';

import { CATEGORY_COLORS } from '@/configs/constants';
import { useCategoryBreakdown } from '@/hooks/api/useCharts';
import { useBudtrTranslation } from '@/hooks/useI18n';

import { ChartErrorBoundary } from './ChartErrorBoundary';
import { ChartSkeleton } from './ChartSkeleton';

const CategoryBreakdownInner = () => {
  const { t } = useBudtrTranslation();
  const { data, isLoading } = useCategoryBreakdown();

  const pieData = useMemo(() => {
    if (!data?.items?.length) return [];
    return data.items.map((item, i) => ({
      id: i,
      value: item.amount,
      label: `${t(`categories.${item.category}`)} ${item.percentage.toFixed(1)}%`,
      color: CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.OTHER,
    }));
  }, [data, t]);

  if (isLoading) return <ChartSkeleton width={{ xs: '100%', md: 400 }} />;

  if (!data || data.total === 0 || !data.items?.length) {
    return (
      <Box sx={ContainerSx}>
        <Typography variant='body2' sx={TitleSx}>
          {t('insights.categoryBreakdown')}
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
        {t('insights.categoryBreakdown')}
        {data.month ? (
          <Typography
            component='span'
            variant='caption'
            sx={{ ml: 1, color: grey[500] }}
          >
            {data.month}
          </Typography>
        ) : null}
      </Typography>

      {/* Donut with center-label overlay */}
      <Box sx={DonutWrapperSx}>
        <PieChart
          series={[
            {
              data: pieData,
              innerRadius: 60,
              outerRadius: 100,
              paddingAngle: 2,
              cornerRadius: 3,
            },
          ]}
          height={240}
          margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
          sx={{ width: '100%' }}
          slots={{ legend: () => null }}
        />
        {/* Center label */}
        <Box sx={CenterLabelSx}>
          <Typography
            variant='caption'
            sx={{ color: grey[500], lineHeight: 1 }}
          >
            {t('insights.total')}
          </Typography>
          <Typography
            variant='subtitle2'
            sx={{ fontWeight: 700, color: grey[800] }}
          >
            {data.total.toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={LegendSx}>
        {data.items.map(item => (
          <Box key={item.category} sx={LegendItemSx}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor:
                  CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.OTHER,
                flexShrink: 0,
              }}
            />
            <Typography variant='caption' sx={{ color: grey[700] }}>
              {t(`categories.${item.category}`)} · {item.percentage.toFixed(1)}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export const CategoryBreakdown = () => (
  <ChartErrorBoundary>
    <CategoryBreakdownInner />
  </ChartErrorBoundary>
);

// Styles
const ContainerSx: SxProps = {
  width: { xs: '100%', md: 400 },
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const EmptyStateSx: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 200,
};

const DonutWrapperSx: SxProps = {
  position: 'relative',
  width: '100%',
};

const CenterLabelSx: SxProps = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  pointerEvents: 'none',
};

const LegendSx: SxProps = {
  display: 'flex',
  gap: 0.5,
  mt: 1,
  overflow: 'auto',
  maxHeight: 120,
  flexWrap: 'wrap',
};

const LegendItemSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};
