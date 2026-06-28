import { Box, SxProps, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

import { useBudgetVsActual } from '@/hooks/api/useCharts';
import { useBudtrTranslation } from '@/hooks/useI18n';

import { ChartErrorBoundary } from './ChartErrorBoundary';
import { ChartSkeleton } from './ChartSkeleton';

const BAR_GREEN = '#22c55e';
const BAR_YELLOW = '#eab308';
const BAR_RED = '#ef4444';

function barColor(actual: number, budgeted: number): string {
  if (budgeted === 0) return actual > 0 ? BAR_RED : BAR_GREEN;
  const ratio = actual / budgeted;
  if (ratio < 0.8) return BAR_GREEN;
  if (ratio < 1.0) return BAR_YELLOW;
  return BAR_RED;
}

const BudgetVsActualInner = () => {
  const { t } = useBudtrTranslation();
  const { data, isLoading } = useBudgetVsActual();

  if (isLoading) {
    return <ChartSkeleton width={{ xs: '100%', md: 420 }} height={400} />;
  }

  const items = data?.items ?? [];

  if (!items.length) {
    return (
      <Box sx={ContainerSx}>
        <Typography component='h3' sx={TitleSx}>
          {t('insights.budgetVsActual')}
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
        {t('insights.budgetVsActual')}
        {data?.month ? (
          <Typography
            component='span'
            variant='caption'
            sx={{ ml: 1, color: grey[500] }}
          >
            {data.month}
          </Typography>
        ) : null}
      </Typography>

      <Box sx={ListSx}>
        {items.map(item => {
          const color = barColor(item.actual, item.budgeted);
          const overBudget = item.variance < 0;
          const ratio =
            item.budgeted > 0
              ? item.actual / item.budgeted
              : item.actual > 0
                ? 1
                : 0;
          const fillPct = Math.min(ratio * 100, 100);

          return (
            <Box key={item.category} sx={RowSx}>
              <Box sx={RowHeaderSx}>
                <Typography
                  variant='body2'
                  sx={{ color: grey[700], fontWeight: 500 }}
                >
                  {t(`categories.${item.category}`)}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    color: overBudget ? BAR_RED : BAR_GREEN,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {overBudget ? '-' : '+'}
                  {Math.abs(item.variance).toLocaleString()}
                </Typography>
              </Box>

              {/* Progress bar */}
              <Box sx={BarTrackSx}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${fillPct}%`,
                    bgcolor: color,
                    borderRadius: '4px',
                    transition: 'width 0.35s ease',
                    ...(overBudget && {
                      backgroundImage:
                        'repeating-linear-gradient(45deg,transparent,transparent 4px,rgba(0,0,0,0.12) 4px,rgba(0,0,0,0.12) 8px)',
                    }),
                  }}
                />
              </Box>

              <Box sx={BarLabelSx}>
                <Typography variant='caption' sx={{ color: grey[400] }}>
                  {item.actual.toLocaleString()} /{' '}
                  {item.budgeted.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export const BudgetVsActual = () => (
  <ChartErrorBoundary>
    <BudgetVsActualInner />
  </ChartErrorBoundary>
);

// Styles
const ContainerSx: SxProps = {
  width: { xs: '100%', md: 420 },
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
  mb: 2,
  color: grey[600],
  fontWeight: 600,
  fontSize: '0.95rem',
  display: 'flex',
  alignItems: 'center',
};

const EmptyStateSx: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 200,
};

const ListSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  overflow: 'auto',
};

const RowSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
};

const RowHeaderSx: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 1,
};

const BarTrackSx: SxProps = {
  position: 'relative',
  height: 8,
  bgcolor: grey[200],
  borderRadius: '4px',
  overflow: 'hidden',
};

const BarLabelSx: SxProps = {
  display: 'flex',
  justifyContent: 'flex-end',
};
