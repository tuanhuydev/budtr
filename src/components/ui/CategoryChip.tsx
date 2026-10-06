import { Box, Chip, SxProps } from '@mui/material';

import { CATEGORY_COLORS } from '@/configs/constants';
import { useBudtrTranslation } from '@/hooks/useI18n';

interface CategoryChipProps {
  category?: string;
}

export const CategoryChip = ({ category }: CategoryChipProps) => {
  const { t } = useBudtrTranslation();
  const key = category || 'OTHER';
  const color = CATEGORY_COLORS[key] ?? CATEGORY_COLORS.OTHER;
  return (
    <Chip
      size='small'
      label={t(`categories.${key}`)}
      icon={<Box sx={{ ...DotSx, bgcolor: color }} />}
      sx={ChipSx}
    />
  );
};

const DotSx: SxProps = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  flexShrink: 0,
  ml: '10px !important',
  mr: '-2px !important',
};

const ChipSx: SxProps = {
  height: 24,
  bgcolor: 'action.hover',
  color: 'text.primary',
};
