import { Dialog, DialogContent, DialogTitle } from '@mui/material';

import { useBudtrTranslation } from '@/hooks/useI18n';
import type { Asset } from '@/types/asset';
import type { Transaction } from '@/types/transaction';

import { TransactionForm } from './TransactionForm';

interface TransactionFormDialogProps {
  open: boolean;
  transaction?: Partial<Transaction> | null;
  assets: Asset[];
  onSave: (data: Partial<Transaction>) => void;
  onClose: () => void;
}

export const TransactionFormDialog = ({
  open,
  transaction,
  assets,
  onSave,
  onClose,
}: TransactionFormDialogProps) => {
  const { t } = useBudtrTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        {transaction
          ? t('transactions.editTransaction')
          : t('transactions.createTransaction')}
      </DialogTitle>
      <DialogContent>
        <TransactionForm
          transaction={transaction ?? undefined}
          assets={assets}
          onSave={onSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
