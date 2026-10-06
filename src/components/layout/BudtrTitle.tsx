import { Box, Collapse, Fade, SxProps, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { neutral } from '@/configs/theme';

const STORAGE_KEY = 'budtr:intro-played';
const HOLD_MS = 1400;
const EASING = 'cubic-bezier(.65, 0, .35, 1)';

const readPlayed = () => {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

const markPlayed = () => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // storage unavailable: the intro just replays next load
  }
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const BudtrTitle = () => {
  const [folded, setFolded] = useState(
    () => readPlayed() || prefersReducedMotion()
  );
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (folded) return;
    const id = setTimeout(() => {
      setFolded(true);
      markPlayed();
    }, HOLD_MS);
    return () => clearTimeout(id);
  }, [folded, runId]);

  const replay = () => {
    if (prefersReducedMotion()) return;
    setFolded(false);
    setRunId(n => n + 1);
  };

  const collapse = (show: boolean, text: string, muted?: boolean) => (
    <Collapse
      orientation='horizontal'
      in={show}
      timeout={{ enter: 700, exit: 700 }}
      easing={EASING}
      component='span'
      sx={{ display: 'inline-block', verticalAlign: 'bottom' }}
    >
      <Fade in={show} timeout={700}>
        <Box
          component='span'
          sx={{ ...SegmentSx, color: muted ? neutral[500] : 'primary.main' }}
        >
          {text}
        </Box>
      </Fade>
    </Collapse>
  );

  return (
    <Typography variant='h1' component='h1' aria-label='Budtr'>
      <Box component='button' type='button' onClick={replay} sx={ButtonSx}>
        <Box component='span' aria-hidden sx={InnerSx}>
          <Box component='span' sx={{ ...SegmentSx, color: 'primary.main' }}>
            Bud
          </Box>
          {collapse(!folded, 'get ', true)}
          {collapse(!folded, 'T')}
          {collapse(folded, 't')}
          <Box component='span' sx={{ ...SegmentSx, color: 'primary.main' }}>
            r
          </Box>
          {collapse(!folded, 'acker', true)}
        </Box>
      </Box>
    </Typography>
  );
};

// Styles
const SegmentSx: SxProps = {
  whiteSpace: 'pre',
};

const InnerSx: SxProps = {
  display: 'inline-flex',
  alignItems: 'baseline',
};

const ButtonSx: SxProps = {
  all: 'unset',
  cursor: 'pointer',
  borderRadius: 1,
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: 'primary.main',
    outlineOffset: 4,
  },
};
