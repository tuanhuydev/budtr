import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, Chip, IconButton, Typography } from '@mui/material';

import { useBudtrTranslation } from '@/hooks/useI18n';
import { Asset, AssetType } from '@/types/asset';

interface AssetCardProps {
  asset: Asset;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
}

const ASSET_TYPE_COLOR: Record<
  AssetType,
  'success' | 'primary' | 'warning' | 'secondary'
> = {
  [AssetType.CASH]: 'success',
  [AssetType.BANK]: 'primary',
  [AssetType.INVESTMENT]: 'warning',
  [AssetType.PHYSICAL]: 'secondary',
};

export const AssetCard = ({ asset, onEdit, onDelete }: AssetCardProps) => {
  const { t } = useBudtrTranslation();
  const typeColor = ASSET_TYPE_COLOR[asset.type] ?? 'default';

  return (
    <Box sx={cardSx}>
      <Box sx={topRowSx}>
        <Chip
          label={t(`assets.type.${asset.type}`)}
          color={typeColor}
          size='small'
          sx={{ fontWeight: 600 }}
        />
        <Box sx={actionsSx}>
          <IconButton
            size='small'
            aria-label={t('common.edit')}
            onClick={() => onEdit(asset)}
          >
            <EditOutlinedIcon fontSize='small' />
          </IconButton>
          <IconButton
            size='small'
            color='error'
            aria-label={t('common.delete')}
            onClick={() => onDelete(asset)}
          >
            <DeleteOutlineIcon fontSize='small' />
          </IconButton>
        </Box>
      </Box>

      <Typography variant='h6' sx={{ fontWeight: 700, mt: 1, mb: 0.5 }}>
        {asset.name}
      </Typography>

      <Typography variant='caption' color='text.secondary'>
        {t('assets.currentBalance')}
      </Typography>
      <Typography variant='h5' sx={{ fontWeight: 700 }}>
        {asset.currentBalance.toLocaleString()}
      </Typography>
    </Box>
  );
};

const cardSx = {
  p: 2,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
};

const topRowSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const actionsSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
};
