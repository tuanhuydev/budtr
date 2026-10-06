import { Box, LinearProgress, SxProps, Typography } from '@mui/material';
import { useMemo } from 'react';

import { WidgetCard } from '@/components/ui/WidgetCard';
import { CATEGORY_COLORS } from '@/configs/constants';
import { neutral, tabularNums } from '@/configs/theme';
import { useCategoryBreakdown } from '@/hooks/api/useCharts';
import { useBudtrTranslation } from '@/hooks/useI18n';

const CategoryBreakdownInner = () => {
  const { t } = useBudtrTranslation();
  const { data, isLoading } = useCategoryBreakdown();

  const items = useMemo(
    () => [...(data?.items ?? [])].sort((a, b) => b.amount - a.amount),
    [data]
  );

  return (
    <WidgetCard
      title={t('overview.categoryMix')}
      subtitle={data?.month || undefined}
      loading={isLoading}
      empty={!data || !items.length ? t('overview.noData') : undefined}
    >
      <Box sx={ListSx}>
        {items.map(item => {
          const color = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.OTHER;
          return (
            <Box key={item.category}>
              <Box sx={RowSx}>
                <Box sx={NameSx}>
                  <Box sx={{ ...DotSx, bgcolor: color }} />
                  <Typography variant='body1'>
                    {t(`categories.${item.category}`)}
                  </Typography>
                </Box>
                <Typography variant='body1' sx={AmountSx}>
                  <b>{item.amount.toLocaleString()}</b>
                  <Box component='span' sx={{ color: 'text.secondary' }}>
                    {' · '}
                    {item.percentage.toFixed(1)}%
                  </Box>
                </Typography>
              </Box>
              <LinearProgress
                variant='determinate'
                value={item.percentage}
                aria-label={t(`categories.${item.category}`)}
                sx={{
                  ...BarSx,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: color,
                    borderRadius: 4,
                    minWidth: 8,
                  },
                }}
              />
            </Box>
          );
        })}
      </Box>
    </WidgetCard>
  );
};

export const CategoryBreakdown = () => <CategoryBreakdownInner />;

// Styles
const ListSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const RowSx: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 1,
  mb: 0.75,
};

const NameSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  minWidth: 0,
};

const DotSx: SxProps = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  flexShrink: 0,
};

const AmountSx: SxProps = {
  whiteSpace: 'nowrap',
  ...tabularNums,
};

const BarSx: SxProps = {
  height: 8,
  borderRadius: 4,
  bgcolor: neutral[100],
};
