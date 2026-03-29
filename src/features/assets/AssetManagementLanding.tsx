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
import { AssetSummary } from './components/AssetSummary';

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
        <Box sx={contentSx}>
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
          <AssetSummary assets={assets} />
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
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
};

const loadingContainerSx = {
  ...containerSx,
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 300,
};

const headerSx = {
  mb: 2,
  mt: { xs: 2, md: 1 },
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

const contentSx = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  gap: 2,
  flexDirection: { xs: 'column', md: 'row' },
};

const cardsGridSx = {
  flex: 1,
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(auto-fit, minmax(min(100%, 300px), 400px))',
  },
  gap: 2,
  alignContent: 'start',
  justifyContent: 'start',
};
