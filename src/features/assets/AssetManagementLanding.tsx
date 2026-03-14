import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';

import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import {
  useAssets,
  useCreateAsset,
  useUpdateAsset,
  useDeleteAsset,
} from '@/hooks/api/useAssets';
import { useBudtrTranslation } from '@/hooks/useI18n';
import { useShellService } from '@/hooks/useShellService';
import type { Asset } from '@/types/asset';
import type { ToastService } from '@/types/shell';

import { AssetCard } from './components/AssetCard';
import { type AssetSaveData } from './components/AssetForm';
import { AssetFormDialog } from './components/AssetFormDialog';

export const AssetManagementLanding = () => {
  const { t } = useBudtrTranslation();
  const toast = useShellService<ToastService>('toast');

  const { data: assets = [], isLoading } = useAssets();
  const createAssetMutation = useCreateAsset();
  const updateAssetMutation = useUpdateAsset();
  const deleteAssetMutation = useDeleteAsset();

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleCreateClick = () => {
    setSelectedAsset(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDeleteOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedAsset(null);
  };

  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
    setSelectedAsset(null);
  };

  const handleSaveAsset = async (data: AssetSaveData) => {
    try {
      if (selectedAsset) {
        await updateAssetMutation.mutateAsync({
          id: selectedAsset.id,
          ...data,
        });
        toast?.success(t('assets.updateSuccess'));
      } else {
        await createAssetMutation.mutateAsync(data);
        toast?.success(t('assets.createSuccess'));
      }
      handleFormClose();
    } catch {
      toast?.error(
        t(selectedAsset ? 'assets.updateFailed' : 'assets.createFailed')
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAsset) {
      return;
    }

    try {
      await deleteAssetMutation.mutateAsync(selectedAsset.id);
      toast?.success(t('assets.deleteSuccess'));
    } catch {
      toast?.error(t('assets.deleteFailed'));
    } finally {
      handleDeleteClose();
    }
  };

  if (isLoading) {
    return (
      <Box sx={loadingContainerSx}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={containerSx}>
      <Box sx={headerSx}>
        <Typography component='h2' variant='h6'>
          {t('assets.title')}
        </Typography>
        <Button variant='contained' onClick={handleCreateClick}>
          {t('assets.createAsset')}
        </Button>
      </Box>

      {assets.length === 0 ? (
        <Box sx={emptyStateSx}>
          <Typography variant='body2' color='text.secondary'>
            {t('assets.noAssets')}
          </Typography>
        </Box>
      ) : (
        <Box sx={cardsGridSx}>
          {assets.map(asset => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </Box>
      )}

      <AssetFormDialog
        open={isFormOpen}
        asset={selectedAsset}
        onSave={handleSaveAsset}
        onClose={handleFormClose}
      />

      <ConfirmDeleteDialog
        open={isDeleteOpen}
        title={t('assets.confirmDelete')}
        message={t('assets.deleteConfirmMessage')}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteClose}
      />
    </Box>
  );
};

const containerSx = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const loadingContainerSx = {
  ...containerSx,
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 300,
};

const headerSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2,
  flexWrap: 'wrap',
};

const emptyStateSx = {
  minHeight: 200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px dashed',
  borderColor: 'divider',
  borderRadius: 2,
  bgcolor: 'background.paper',
};

const cardsGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
    lg: 'repeat(3, minmax(0, 1fr))',
  },
  gap: 2,
};
