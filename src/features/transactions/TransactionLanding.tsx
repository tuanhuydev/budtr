import { Box, Button, CircularProgress, Menu, MenuItem } from '@mui/material';
import { GridPaginationModel } from '@mui/x-data-grid';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { DateRangePicker, DateRange } from '@/components/DateRangePicker';
import { useBudgets } from '@/hooks/api/useBudgets';
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/hooks/api/useTransactions';
import { useBudtrTranslation } from '@/hooks/useI18n';
import { useShellService } from '@/hooks/useShellService';
import type { ToastService } from '@/types/shell';
import { Transaction } from '@/types/transaction';

import { TransactionFormDialog } from './components/TransactionFormDialog';
import { TransactionSummary } from './components/TransactionSummary';
import { TransactionTable } from './components/TransactionTable';

export const TransactionLanding = () => {
  // region Hooks
  const { t } = useBudtrTranslation();
  const toast = useShellService<ToastService>('toast');

  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startDate, endDate };
  });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  // React Query hooks
  const { data: transactionsData, isLoading: transactionsLoading } =
    useTransactions({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
    });
  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets();
  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();

  const transactions = transactionsData?.transactions ?? [];

  // Maintain stable rowCount during loading to prevent undefined issues
  const rowCountRef = useRef(transactionsData?.total || 0);
  const rowCount = useMemo(() => {
    if (transactionsData?.total !== undefined) {
      rowCountRef.current = transactionsData.total;
    }
    return rowCountRef.current;
  }, [transactionsData?.total]);

  // Reset to first page when date range changes or when transactions update
  useEffect(() => {
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  }, [dateRange.startDate, dateRange.endDate]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, transaction: Transaction) => {
      setAnchorEl(event.currentTarget);
      setSelectedTransaction(transaction);
    },
    []
  );

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    if (selectedTransaction) {
      setModalOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleModalOpen = () => {
    setSelectedTransaction(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleSave = async (data: Partial<Transaction>) => {
    const isEdit = !!selectedTransaction;

    try {
      const transactionData = {
        type: data.type || '',
        category: data.category || '',
        amount: data.amount || 0,
        currency: data.currency || 'VND',
        source: data.source,
        behavior: data.behavior,
        description: data.description,
        createdAt: data.createdAt,
      };

      if (isEdit) {
        await updateTransactionMutation.mutateAsync({
          id: selectedTransaction.id,
          ...transactionData,
        });
      } else {
        await createTransactionMutation.mutateAsync(transactionData);
      }

      toast?.success(
        t(isEdit ? 'transactions.updateSuccess' : 'transactions.createSuccess')
      );
      handleModalClose();
    } catch {
      toast?.error(
        t(isEdit ? 'transactions.updateFailed' : 'transactions.createFailed')
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTransaction) return;

    try {
      await deleteTransactionMutation.mutateAsync(selectedTransaction.id);
      toast?.success(t('transactions.deleteSuccess'));
    } catch {
      toast?.error(t('transactions.deleteFailed'));
    } finally {
      setDeleteDialogOpen(false);
      setSelectedTransaction(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDateRangeChange = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
  };

  if (transactionsLoading || budgetsLoading) {
    return (
      <Box sx={LoadingContainerSx}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={containerSx}>
      <Box sx={headerSx}>
        <Box
          display='flex'
          gap={{ xs: 2, md: 4 }}
          sx={{ width: '100%' }}
          alignItems={{ md: 'center', xs: 'flex-start' }}
          flexDirection={{ xs: 'column-reverse', md: 'row' }}
          flexWrap={'wrap'}
        >
          <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
          <Button
            variant='contained'
            onClick={handleModalOpen}
            sx={{ ml: 'auto' }}
          >
            {t('common.create')}
          </Button>
        </Box>
      </Box>

      <Box sx={contentSx}>
        <TransactionTable
          transactions={transactions}
          rowCount={rowCount}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={transactionsLoading}
          onMenuClick={handleMenuClick}
        />
        <TransactionSummary transactions={transactions} />
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>{t('common.edit')}</MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          {t('common.delete')}
        </MenuItem>
      </Menu>

      <TransactionFormDialog
        open={modalOpen}
        transaction={selectedTransaction}
        budgets={budgets}
        onSave={handleSave}
        onClose={handleModalClose}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        title={t('transactions.confirmDelete')}
        message={t('transactions.deleteConfirmMessage')}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
      />
    </Box>
  );
};

// Styles
const containerSx = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
};

const headerSx = {
  mb: 2,
  mt: { xs: 2, md: 1 },
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const contentSx = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  gap: 2,
  flexDirection: { xs: 'column', md: 'row' },
};

const LoadingContainerSx = {
  ...containerSx,
  justifyContent: 'center',
  alignItems: 'center',
};
