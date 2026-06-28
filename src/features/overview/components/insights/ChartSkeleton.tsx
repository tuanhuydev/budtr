import { Box, Skeleton, SxProps } from '@mui/material';
import { grey } from '@mui/material/colors';

type ResponsiveValue = number | string | Record<string, number | string>;

interface Props {
  width?: ResponsiveValue;
  height?: ResponsiveValue;
}

export const ChartSkeleton = ({ width = 400, height = 400 }: Props) => (
  <Box sx={{ ...ContainerSx, width, height }}>
    <Skeleton variant='text' width='55%' height={28} sx={{ mb: 1.5 }} />
    <Skeleton
      variant='rectangular'
      width='100%'
      sx={{ flex: 1, borderRadius: 1 }}
    />
  </Box>
);

const ContainerSx: SxProps = {
  background: 'white',
  border: `solid 1px ${grey[200]}`,
  borderRadius: 2,
  p: 2,
  display: 'flex',
  flexDirection: 'column',
};
