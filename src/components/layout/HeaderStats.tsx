import {
  Box,
  CircularProgress,
  LinearProgress,
  Skeleton,
  SxProps,
  Typography,
} from '@mui/material';
import { ReactNode } from 'react';

import { tabularNums } from '@/configs/theme';
import { useSavingsProgress } from '@/hooks/api/useCharts';
import { useBudtrTranslation } from '@/hooks/useI18n';
import { PeriodSummary } from '@/hooks/usePeriodSummary';

interface HeaderStatsProps {
  summary: PeriodSummary | null;
  loading: boolean;
}

const DASH = '—';

const Stat = ({
  label,
  loading,
  children,
}: {
  label: string;
  loading?: boolean;
  children: ReactNode;
}) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography variant='overline' color='text.secondary' component='div'>
      {label}
    </Typography>
    {loading ? (
      <Skeleton variant='text' width={96} height={28} />
    ) : (
      <Box sx={ValueRowSx}>{children}</Box>
    )}
  </Box>
);

export const HeaderStats = ({ summary, loading }: HeaderStatsProps) => {
  const { t } = useBudtrTranslation();
  const { data: savings, isLoading: savingsLoading } = useSavingsProgress();
  const hasExpenses = !!summary && summary.fixedShare !== null;
  const rate = savings?.projectedSavingsRate;
  const rateNegative = rate !== undefined && rate < 0;
  const ring = Math.min(100, Math.max(0, rate ?? 0));

  return (
    <Box sx={GridSx}>
      <Stat label={t('overview.spent')} loading={loading}>
        {summary ? (
          <>
            <Typography sx={ValueSx}>
              {summary.spent.toLocaleString()}
            </Typography>
            <Typography sx={MutedSx}>{summary.currency}</Typography>
          </>
        ) : (
          <Typography sx={ValueSx}>{DASH}</Typography>
        )}
      </Stat>

      <Stat label={t('overview.fixedVariable')} loading={loading}>
        {hasExpenses ? (
          <>
            <Typography sx={ValueSx}>
              {summary.fixedShare}% / {100 - (summary.fixedShare ?? 0)}%
            </Typography>
            <LinearProgress
              variant='determinate'
              value={summary.fixedShare ?? 0}
              aria-label={`${t('overview.fixedLabel')} ${summary.fixedShare}%`}
              sx={BarSx}
            />
          </>
        ) : (
          <Typography sx={ValueSx}>{DASH}</Typography>
        )}
      </Stat>

      <Stat label={t('overview.savingsRate')} loading={savingsLoading}>
        {rate !== undefined ? (
          <>
            <Typography
              sx={{
                ...ValueSx,
                color: rateNegative ? 'error.main' : 'text.primary',
              }}
            >
              {rate.toFixed(1)}%
            </Typography>
            <Typography sx={MutedSx}>{t('insights.projected')}</Typography>
            <Box sx={RingSx} aria-hidden>
              <CircularProgress
                variant='determinate'
                value={100}
                size={20}
                thickness={5}
                sx={{ color: 'divider', position: 'absolute' }}
              />
              <CircularProgress
                variant='determinate'
                value={rateNegative ? 0 : ring}
                size={20}
                thickness={5}
                sx={{ color: 'primary.main', position: 'absolute' }}
              />
            </Box>
          </>
        ) : (
          <Typography sx={ValueSx}>{DASH}</Typography>
        )}
      </Stat>

      <Stat label={t('overview.topCategory')} loading={loading}>
        {summary?.topCategory ? (
          <>
            <Typography sx={ValueSx}>
              {t(`categories.${summary.topCategory.category}`)}
            </Typography>
            <Typography sx={MutedSx}>
              {summary.topCategory.share.toFixed(1)}%
            </Typography>
          </>
        ) : (
          <Typography sx={ValueSx}>{DASH}</Typography>
        )}
      </Stat>
    </Box>
  );
};

// Styles
const GridSx: SxProps = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '20px 24px',
  '@container (min-width: 960px)': {
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    columnGap: 5,
  },
};

const ValueRowSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  columnGap: 1,
  rowGap: 0.5,
};

const ValueSx: SxProps = {
  fontSize: 20,
  lineHeight: '28px',
  fontWeight: 500,
  ...tabularNums,
};

const MutedSx: SxProps = {
  fontSize: 14,
  lineHeight: '20px',
  color: 'text.secondary',
};

const BarSx: SxProps = {
  width: 56,
  height: 8,
  borderRadius: 4,
  bgcolor: '#C5CCD2',
  '& .MuiLinearProgress-bar': { bgcolor: 'primary.main', borderRadius: 4 },
};

const RingSx: SxProps = {
  position: 'relative',
  width: 20,
  height: 20,
};
