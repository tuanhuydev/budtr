import { Dialog, DialogContent, DialogTitle } from '@mui/material';

import { useBudtrTranslation } from '@/hooks/useI18n';
import type { Asset } from '@/types/asset';

import { AssetForm, type AssetSaveData } from './AssetForm';

interface AssetFormDialogProps {
  open: boolean;
  asset: Asset | null;
  onSave: (data: AssetSaveData) => void;
  onClose: () => void;
}

export const AssetFormDialog = ({
  open,
  asset,
  onSave,
  onClose,
}: AssetFormDialogProps) => {
  const { t } = useBudtrTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        {asset ? t('assets.editAsset') : t('assets.createAsset')}
      </DialogTitle>
      <DialogContent>
        <AssetForm asset={asset} onSave={onSave} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};
