import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMemo } from 'react';

import { useBudtrTranslation } from '@/hooks/useI18n';
import { Transaction } from '@/types/transaction';
import { formatTransactionAmount } from '@/utils/transactionFormatter';

interface TransactionTableProps {
  transactions: Transaction[];
  rowCount: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  loading: boolean;
  onMenuClick: (
    event: React.MouseEvent<HTMLElement>,
    transaction: Transaction
  ) => void;
}

export const TransactionTable = ({
  transactions,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  loading,
  onMenuClick,
}: TransactionTableProps) => {
  const { t } = useBudtrTranslation();

  const columns = useMemo<GridColDef[]>(
    () => [
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
          <IconButton onClick={e => onMenuClick(e, params.row)}>
            <MoreVertIcon />
          </IconButton>
        ),
      },
    ],
    [t, onMenuClick]
  );

  return (
    <Box sx={{ flex: 1, minHeight: 0 }}>
      <DataGrid
        rows={transactions}
        columns={columns}
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationMode='server'
        loading={loading}
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
  );
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
