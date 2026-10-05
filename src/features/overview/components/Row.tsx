import { Box, SxProps } from '@mui/material';
import { ReactNode } from 'react';

interface RowProps {
  left: ReactNode;
  right: ReactNode;
}

// 7/5 split shared by every row so the vertical hairline lines up.
export const Row = ({ left, right }: RowProps) => (
  <Box sx={RowSx}>
    <Box sx={{ ...CellSx, flex: '7 1 520px' }}>{left}</Box>
    <Box sx={{ ...CellSx, flex: '5 1 340px' }}>{right}</Box>
  </Box>
);

// Styles
const RowSx: SxProps = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1px',
  bgcolor: 'divider',
};

const CellSx: SxProps = {
  minWidth: 0,
  bgcolor: 'background.paper',
};
