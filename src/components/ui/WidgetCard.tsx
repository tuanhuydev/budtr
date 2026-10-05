import { Box, Paper, Skeleton, SxProps, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { CHART_HEIGHT } from '@/configs/chartTheme';
import { ChartErrorBoundary } from '@/features/overview/components/insights/ChartErrorBoundary';

import { EmptyState } from './EmptyState';
import { WidgetSurface, useWidgetSurface } from './WidgetSurfaceContext';

interface WidgetCardProps {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
  loading?: boolean;
  /** When set, replaces the children with an empty-state message. */
  empty?: string;
  variant?: WidgetSurface;
  children?: ReactNode;
}

export const WidgetCard = ({
  title,
  subtitle,
  action,
  loading,
  empty,
  variant,
  children,
}: WidgetCardProps) => {
  const surface = useWidgetSurface();
  const resolved = variant ?? surface;

  let body: ReactNode = children;
  if (loading) {
    body = (
      <>
        <Skeleton variant='text' width='40%' height={20} />
        <Skeleton
          variant='rectangular'
          width='100%'
          height={CHART_HEIGHT}
          sx={{ borderRadius: 1, mt: 1 }}
        />
      </>
    );
  } else if (empty) {
    body = <EmptyState message={empty} />;
  }

  const content = (
    <>
      <Box sx={HeaderSx}>
        <Box sx={{ minWidth: 0 }}>
          <Typography component='h2' variant='h2'>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant='caption' color='text.secondary'>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {action ? <Box sx={ActionSx}>{action}</Box> : null}
      </Box>
      <ChartErrorBoundary>{body}</ChartErrorBoundary>
    </>
  );

  if (resolved === 'flat') {
    return <Box sx={FlatSx}>{content}</Box>;
  }
  return (
    <Paper variant='outlined' sx={OutlinedSx}>
      {content}
    </Paper>
  );
};

// Styles
const HeaderSx: SxProps = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 1,
  mb: 2,
};

const ActionSx: SxProps = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 0.5,
  alignItems: 'center',
};

const FlatSx: SxProps = {
  p: { xs: 2, sm: 3 },
  minWidth: 0,
  width: '100%',
  boxSizing: 'border-box',
};

const OutlinedSx: SxProps = {
  p: { xs: 2, sm: 3 },
  minWidth: 0,
  width: '100%',
  boxSizing: 'border-box',
};
