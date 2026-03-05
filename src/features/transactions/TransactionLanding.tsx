import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useState, useEffect, useRef, useMemo } from 'react';

import { DateRangePicker, DateRange } from '@/components/DateRangePicker';
import { useBudgets } from '@/hooks/api/useBudgets';
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/hooks/api/useTransactions';
import { useBudtrTranslation } from '@/hooks/useI18n';
import { Transaction } from '@/types/transaction';
import { formatTransactionAmount } from '@/utils/transactionFormatter';

import { TransactionForm } from './components/TransactionForm';

export const TransactionLanding = () => {
  // region Hooks
  const { t } = useBudtrTranslation();

  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 3);
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + 3);
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    transaction: Transaction
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  };

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

      setSnackbar({
        open: true,
        message: t(
          isEdit ? 'transactions.updateSuccess' : 'transactions.createSuccess'
        ),
        severity: 'success',
      });
      handleModalClose();
    } catch {
      setSnackbar({
        open: true,
        message: t(
          isEdit ? 'transactions.updateFailed' : 'transactions.createFailed'
        ),
        severity: 'error',
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTransaction) return;

    try {
      await deleteTransactionMutation.mutateAsync(selectedTransaction.id);
      setSnackbar({
        open: true,
        message: t('transactions.deleteSuccess'),
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: t('transactions.deleteFailed'),
        severity: 'error',
      });
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

  const columns: GridColDef[] = [
    { field: 'id', headerName: t('transactions.id'), width: 90 },
    {
      field: 'amount',
      headerName: t('transactions.amount'),
      width: 180,
      renderCell: params => {
        const { displayText, color } = formatTransactionAmount(
          params.row.amount,
          params.row.type,
          params.row.currency
        );
        return (
          <Typography variant='body2' sx={{ ...amountCellSx, color }}>
            {displayText}
          </Typography>
        );
      },
    },
    {
      field: 'category',
      headerName: t('transactions.category'),
      width: 150,
      renderCell: params =>
        params.row?.category
          ? t(`categories.${params.row.category}`)
          : t(`categories.OTHER`),
    },
    {
      field: 'behavior',
      headerName: t('transactions.behavior'),
      width: 100,
      renderCell: params =>
        params.row?.behavior
          ? t(`transactions.${params.row.behavior}`)
          : t(`categories.OTHER`),
    },

    {
      field: 'createdAt',
      headerName: t('transactions.createdAt'),
      width: 180,
      valueFormatter: value => new Date(value).toLocaleDateString(),
    },
    {
      field: 'description',
      headerName: t('transactions.description'),
      flex: 1,
      minWidth: 200,
      renderCell: params => (
        <Typography variant='body2' sx={descriptionCellSx}>
          {params.row.description || t('transactions.noDescription')}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: t('transactions.actions'),
      width: 100,
      sortable: false,
      renderCell: params => (
        <IconButton onClick={e => handleMenuClick(e, params.row)}>
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

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

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <DataGrid
          rows={transactions}
          columns={columns}
          rowCount={rowCount}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationMode='server'
          loading={transactionsLoading}
          disableRowSelectionOnClick
          disableColumnSorting
          disableColumnMenu
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
          }}
        />
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

      {/* Transaction Modal (Create/Edit) */}
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          {selectedTransaction
            ? t('transactions.editTransaction')
            : t('transactions.createTransaction')}
        </DialogTitle>
        <DialogContent>
          <TransactionForm
            transaction={selectedTransaction || undefined}
            budgets={budgets}
            onSave={handleSave}
            onCancel={handleModalClose}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>{t('transactions.confirmDelete')}</DialogTitle>
        <DialogContent>
          <Typography>{t('transactions.deleteConfirmMessage')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant='text' color='info' onClick={handleDeleteCancel}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant='contained'
            color='error'
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
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

const amountCellSx = {
  fontWeight: 600,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
};

const descriptionCellSx = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
};

const LoadingContainerSx = {
  ...containerSx,
  justifyContent: 'center',
  alignItems: 'center',
};
