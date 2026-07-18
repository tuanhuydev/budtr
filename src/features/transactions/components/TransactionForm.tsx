import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, MenuItem, SxProps, Typography } from '@mui/material';
import { ReactNode, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormAmountInput } from '@/components/form/FormAmountInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormTextField } from '@/components/form/FormTextField';
import { useBudtrTranslation } from '@/hooks/useI18n';
import type { Asset } from '@/types/asset';
import { ExpenseBehavior } from '@/types/common';
import { Transaction, ExpenseCategory, ExpenseType } from '@/types/transaction';

const buildSchema = (msgs: { amountRequired: string }) =>
  z.object({
    type: z.enum(ExpenseType),
    amount: z
      .string()
      .refine(
        v => !Number.isNaN(Number(v)) && Number(v) > 0,
        msgs.amountRequired
      ),
    category: z.enum(ExpenseCategory),
    behavior: z.enum(ExpenseBehavior),
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
  assets: Asset[];
  onSave: (data: Partial<Transaction>) => void;
  onCancel: () => void;
}

const FormField = ({
  htmlFor,
  label,
  children,
}: {
  htmlFor: string;
  label: string;
  children: ReactNode;
}) => (
  <Box>
    <Typography
      component='label'
      htmlFor={htmlFor}
      variant='caption'
      sx={fieldLabelSx}
    >
      {label}
    </Typography>
    {children}
  </Box>
);

export const TransactionForm = ({
  transaction,
  assets,
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
      <Box sx={fieldRowSx}>
        <Box sx={fieldRowItemSx}>
          <FormField htmlFor='type-field' label={t('transactions.type')}>
            <FormSelect id='type-field' name='type' control={control} fullWidth>
              {Object.values(ExpenseType).map(type => (
                <MenuItem key={type} value={type}>
                  {t(`transactions.${type}`)}
                </MenuItem>
              ))}
            </FormSelect>
          </FormField>
        </Box>
        <Box sx={fieldRowItemSx}>
          <FormField htmlFor='amount-field' label={t('transactions.amount')}>
            <FormAmountInput
              id='amount-field'
              name='amount'
              control={control}
              fullWidth
            />
          </FormField>
        </Box>
      </Box>

      <FormField htmlFor='category-field' label={t('transactions.category')}>
        <FormSelect
          id='category-field'
          name='category'
          control={control}
          fullWidth
        >
          {Object.values(ExpenseCategory).map(category => (
            <MenuItem key={category} value={category}>
              {t(`categories.${category}`)}
            </MenuItem>
          ))}
        </FormSelect>
      </FormField>

      <Box sx={fieldRowSx}>
        <Box sx={fieldRowItemSx}>
          <FormField
            htmlFor='behavior-field'
            label={t('transactions.behavior')}
          >
            <FormSelect
              id='behavior-field'
              name='behavior'
              control={control}
              fullWidth
            >
              {Object.values(ExpenseBehavior).map(behavior => (
                <MenuItem key={behavior} value={behavior}>
                  {t(`transactions.${behavior}`)}
                </MenuItem>
              ))}
            </FormSelect>
          </FormField>
        </Box>
        <Box sx={fieldRowItemSx}>
          <FormField htmlFor='source-field' label={t('transactions.source')}>
            <FormSelect
              id='source-field'
              name='source'
              control={control}
              fullWidth
              disabled={assets?.length <= 0}
            >
              <MenuItem value=''>
                {assets?.length <= 0
                  ? t('overview.noSourcesAvailable')
                  : t('overview.selectSource')}
              </MenuItem>
              {assets.map(asset => (
                <MenuItem key={asset.id} value={asset.id}>
                  {asset.name}
                </MenuItem>
              ))}
            </FormSelect>
          </FormField>
        </Box>
      </Box>

      <FormField htmlFor='date-field' label={t('transactions.date')}>
        <FormTextField
          id='date-field'
          name='createdAt'
          control={control}
          type='date'
          fullWidth
        />
      </FormField>

      <FormField
        htmlFor='description-field'
        label={t('transactions.description')}
      >
        <FormTextField
          id='description-field'
          name='description'
          control={control}
          multiline
          rows={3}
          fullWidth
        />
      </FormField>

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

const fieldRowSx: SxProps = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 2,
};

const fieldRowItemSx: SxProps = {
  flex: 1,
  minWidth: 0,
};

const fieldLabelSx: SxProps = {
  display: 'block',
  mb: 0.5,
  fontWeight: 500,
  color: 'text.secondary',
};

const actionButtonsContainerSx: SxProps = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 1,
  mt: 1,
};
