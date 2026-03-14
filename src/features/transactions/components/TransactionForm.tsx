import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, MenuItem, SxProps } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormAmountInput } from '@/components/form/FormAmountInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormTextField } from '@/components/form/FormTextField';
import { useBudtrTranslation } from '@/hooks/useI18n';
import { ExpenseBehavior } from '@/types/common';
import { Transaction, ExpenseCategory, ExpenseType } from '@/types/transaction';

const buildSchema = (msgs: { amountRequired: string }) =>
  z.object({
    type: z.nativeEnum(ExpenseType),
    amount: z
      .string()
      .refine(
        v => !Number.isNaN(Number(v)) && Number(v) > 0,
        msgs.amountRequired
      ),
    category: z.nativeEnum(ExpenseCategory),
    behavior: z.nativeEnum(ExpenseBehavior),
    source: z.string(),
    createdAt: z.string().min(1),
    description: z.string(),
  });

type TransactionFormValues = z.infer<ReturnType<typeof buildSchema>>;

const getDefaultValues = (tx?: Partial<Transaction>): TransactionFormValues => {
  const today = new Date().toISOString().split('T')[0];
  return {
    type: tx?.type ?? ExpenseType.EXPENSE,
    amount: tx?.amount ? String(tx.amount) : '',
    category: tx?.category ?? ExpenseCategory.FOOD,
    behavior: tx?.behavior ?? ExpenseBehavior.FIXED,
    source: tx?.source ?? '',
    description: tx?.description ?? '',
    createdAt: tx?.createdAt ? tx.createdAt.split('T')[0] : today,
  };
};

interface TransactionFormProps {
  transaction?: Partial<Transaction>;
  budgets: unknown[];
  onSave: (data: Partial<Transaction>) => void;
  onCancel: () => void;
}

export const TransactionForm = ({
  transaction,
  budgets,
  onSave,
  onCancel,
}: TransactionFormProps) => {
  const { t } = useBudtrTranslation();

  const schema = useMemo(
    () => buildSchema({ amountRequired: t('transactions.amountRequired') }),
    [t]
  );

  const { control, handleSubmit, reset } = useForm<TransactionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(transaction),
  });

  useEffect(() => {
    reset(getDefaultValues(transaction));
  }, [transaction, reset]);

  const onSubmit = (values: TransactionFormValues) => {
    onSave({
      type: values.type,
      amount: Number(values.amount),
      category: values.category,
      behavior: values.behavior,
      source: values.source || undefined,
      description: values.description,
      currency: 'VND',
      createdAt: values.createdAt
        ? new Date(values.createdAt).toISOString()
        : undefined,
    });
  };

  return (
    <Box
      component='form'
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={formContainerSx}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ width: 150 }}>
          <FormSelect
            name='type'
            control={control}
            label={t('transactions.type')}
          >
            {Object.values(ExpenseType).map(type => (
              <MenuItem key={type} value={type}>
                {t(`transactions.${type}`)}
              </MenuItem>
            ))}
          </FormSelect>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FormAmountInput
            name='amount'
            control={control}
            label={t('transactions.amount')}
            fullWidth
          />
        </Box>
      </Box>

      <FormSelect
        name='category'
        control={control}
        label={t('transactions.category')}
      >
        {Object.values(ExpenseCategory).map(category => (
          <MenuItem key={category} value={category}>
            {t(`categories.${category}`)}
          </MenuItem>
        ))}
      </FormSelect>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <FormSelect
            name='behavior'
            control={control}
            fullWidth
            label={t('transactions.behavior')}
          >
            {Object.values(ExpenseBehavior).map(behavior => (
              <MenuItem key={behavior} value={behavior}>
                {t(`transactions.${behavior}`)}
              </MenuItem>
            ))}
          </FormSelect>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FormSelect
            name='source'
            control={control}
            fullWidth
            label={t('transactions.source')}
            disabled={budgets?.length <= 0}
          >
            <MenuItem value=''>
              {budgets?.length <= 0
                ? t('overview.noBudgetsAvailable')
                : t('transactions.source')}
            </MenuItem>
          </FormSelect>
        </Box>
      </Box>

      <FormTextField
        name='createdAt'
        control={control}
        label={t('transactions.date')}
        type='date'
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <FormTextField
        name='description'
        control={control}
        label={t('transactions.description')}
        placeholder={t('transactions.description')}
        multiline
        rows={3}
        fullWidth
      />

      <Box sx={actionButtonsContainerSx}>
        <Button type='button' onClick={onCancel} variant='text' color='primary'>
          {t('common.cancel')}
        </Button>
        <Button type='submit' variant='contained' color='primary'>
          {t('common.save')}
        </Button>
      </Box>
    </Box>
  );
};

const formContainerSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  mt: 2,
};

const actionButtonsContainerSx: SxProps = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 1,
  mt: 1,
};
