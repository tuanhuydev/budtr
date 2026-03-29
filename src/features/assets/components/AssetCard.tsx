import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import { useState } from 'react';

import { HIDDEN_BALANCE_PATTERN } from '@/configs/constants';
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
  const [showBalance, setShowBalance] = useState(false);

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

      <Box sx={balanceContainerSx}>
        <Box>
          <Typography variant='caption' color='text.secondary'>
            {t('assets.currentBalance')}
          </Typography>
          <Typography variant='h5' sx={{ fontWeight: 700 }}>
            {showBalance
              ? `${asset.currentBalance.toLocaleString()} ${asset.currency || 'VND'}`
              : HIDDEN_BALANCE_PATTERN}
          </Typography>
        </Box>
        <IconButton
          size='small'
          onClick={() => setShowBalance(!showBalance)}
          aria-label={showBalance ? 'Hide balance' : 'Show balance'}
        >
          {showBalance ? (
            <VisibilityOff fontSize='small' />
          ) : (
            <Visibility fontSize='small' />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

const cardSx = {
  p: 2,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  maxWidth: 400,
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

const balanceContainerSx = {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: 1,
};
