import { Dialog, DialogContent, DialogTitle } from '@mui/material';

import { useBudtrTranslation } from '@/hooks/useI18n';
import type { Transaction } from '@/types/transaction';

import { TransactionForm } from './TransactionForm';

interface TransactionFormDialogProps {
  open: boolean;
  transaction?: Partial<Transaction> | null;
  budgets: unknown[];
  onSave: (data: Partial<Transaction>) => void;
  onClose: () => void;
}

export const TransactionFormDialog = ({
  open,
  transaction,
  budgets,
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
          budgets={budgets}
          onSave={onSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
