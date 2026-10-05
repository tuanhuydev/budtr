import { Box, SxProps, Typography } from '@mui/material';

export interface ChartLegendItem {
  id: string;
  label: string;
  color: string;
  shape?: 'dot' | 'square';
}

interface ChartLegendProps {
  items: ChartLegendItem[];
  centered?: boolean;
}

export const ChartLegend = ({ items, centered }: ChartLegendProps) => (
  <Box sx={{ ...RootSx, justifyContent: centered ? 'center' : 'flex-start' }}>
    {items.map(item => (
      <Box key={item.id} sx={ItemSx}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: item.shape === 'square' ? '2px' : '50%',
            bgcolor: item.color,
            flexShrink: 0,
          }}
        />
        <Typography variant='caption' color='text.secondary'>
          {item.label}
        </Typography>
      </Box>
    ))}
  </Box>
);

const RootSx: SxProps = {
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: 2.5,
  rowGap: 1,
  mt: 1.5,
};

const ItemSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
};
