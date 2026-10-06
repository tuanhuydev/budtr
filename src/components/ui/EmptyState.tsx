import { SvgIcon, Typography, Box, SxProps } from '@mui/material';

interface EmptyStateProps {
  message: string;
  minHeight?: number;
}

export const EmptyState = ({ message, minHeight = 160 }: EmptyStateProps) => (
  <Box sx={{ ...RootSx, minHeight }}>
    <SvgIcon
      sx={IconSx}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M4 20V10M10 20V4M16 20v-8M22 20H2' />
    </SvgIcon>
    <Typography variant='body2' color='text.secondary'>
      {message}
    </Typography>
  </Box>
);

const RootSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1,
  textAlign: 'center',
};

const IconSx: SxProps = {
  width: 32,
  height: 32,
  color: 'text.disabled',
  fill: 'none',
};
