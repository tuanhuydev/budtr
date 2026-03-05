import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

import { AmountInput } from '@/components/AmountInput';
import { useBudtrTranslation } from '@/hooks/useI18n';
import { Transaction, ExpenseCategory, ExpenseType } from '@/types/transaction';

import { DropdownOption, ExpenseBehavior } from '../../../types/common';

interface TransactionFormProps {
  transaction?: Partial<Transaction>;
  budgets: any[];
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

  const [formData, setFormData] = React.useState<Partial<Transaction>>(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      type: transaction?.type || ExpenseType.EXPENSE,
      category: transaction?.category || ExpenseCategory.FOOD,
      behavior: transaction?.behavior || ExpenseBehavior.FIXED,
      amount: transaction?.amount || 0,
      currency: transaction?.currency || 'VND',
      source: transaction?.source || '',
      description: transaction?.description || '',
      createdAt: transaction?.createdAt
        ? transaction.createdAt.split('T')[0]
        : today,
    };
  });

  // Sync form data when transaction prop changes
  React.useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      type: transaction?.type || ExpenseType.EXPENSE,
      category: transaction?.category || ExpenseCategory.FOOD,
      behavior: transaction?.behavior || ExpenseBehavior.FIXED,
      amount: transaction?.amount || 0,
      currency: transaction?.currency || 'VND',
      source: transaction?.source || '',
      description: transaction?.description || '',
      createdAt: transaction?.createdAt
        ? transaction.createdAt.split('T')[0]
        : today,
    });
  }, [transaction]);

  const handleFieldChange =
    (field: keyof Transaction) =>
    (
      event: SelectChangeEvent<unknown> | React.ChangeEvent<HTMLInputElement>
    ) => {
      setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, amount: Number(event.target.value) }));
  };

  const handleSave = () => {
    // Convert date string to ISO format if present
    const dataToSave = {
      ...formData,
      createdAt: formData.createdAt
        ? new Date(formData.createdAt).toISOString()
        : undefined,
    };
    onSave(dataToSave);
  };

  return (
    <Box sx={FormContainerSx}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ width: 150 }}>
          <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 500 }}>
            {t('transactions.type')}
          </Typography>
          <FormControl fullWidth>
            <Select
              value={formData.type || ''}
              onChange={handleFieldChange('type')}
              displayEmpty
            >
              <MenuItem value='' disabled>
                {t('transactions.type')}
              </MenuItem>
              {Object.values(ExpenseType).map(type => (
                <MenuItem key={type} value={type}>
                  {t(`transactions.${type}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 500 }}>
            {t('transactions.amount')}
          </Typography>
          <AmountInput
            value={formData.amount || 0}
            onChange={handleAmountChange}
            fullWidth
          />
        </Box>
      </Box>
      <Box>
        <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 500 }}>
          {t('transactions.category')}
        </Typography>
        <FormControl fullWidth>
          <Select
            value={formData.category || ''}
            onChange={handleFieldChange('category')}
            displayEmpty
          >
            <MenuItem value='' disabled>
              {t('transactions.category')}
            </MenuItem>
            {Object.values(ExpenseCategory).map(category => (
              <MenuItem key={category} value={category}>
                {t(`categories.${category}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 500 }}>
            {t('transactions.behavior')}
          </Typography>
          <FormControl fullWidth>
            <Select
              value={formData.behavior || ''}
              onChange={handleFieldChange('behavior')}
            >
              {Object.values(ExpenseBehavior).map(behavior => (
                <MenuItem key={behavior} value={behavior}>
                  {t(`transactions.${behavior}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 500 }}>
            {t('transactions.source')}
          </Typography>
          <FormControl fullWidth>
            <Select
              value={formData.source || ''}
              onChange={handleFieldChange('source')}
              disabled={budgets?.length <= 0}
              displayEmpty
            >
              <MenuItem value=''>
                {budgets?.length <= 0
                  ? t('overview.noBudgetsAvailable')
                  : t('transactions.source')}
              </MenuItem>
              {budgets.map(({ label, value }: DropdownOption<any>) => (
                <MenuItem value={value} key={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box>
        <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 500 }}>
          {t('transactions.date')}
        </Typography>
        <TextField
          fullWidth
          type='date'
          value={formData.createdAt || ''}
          onChange={e =>
            setFormData(prev => ({ ...prev, createdAt: e.target.value }))
          }
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </Box>
      <Box>
        <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 500 }}>
          {t('transactions.description')}
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder={t('transactions.description')}
          value={formData.description || ''}
          onChange={e =>
            setFormData(prev => ({ ...prev, description: e.target.value }))
          }
        />
      </Box>
      <Box sx={ActionButtonsContainerSx}>
        <Button onClick={onCancel} variant='text' color='secondary'>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSave}
          variant='contained'
          color='primary'
          disabled={(formData.amount || 0) <= 0}
        >
          {t('common.save')}
        </Button>
      </Box>
    </Box>
  );
};

// Styles
const FormContainerSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  mt: 2,
};

const ActionButtonsContainerSx: SxProps = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 1,
  mt: 1,
};
