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
import { Expense, ExpenseCategory, ExpenseType } from '@/types/expense';

interface ExpenseFormProps {
  expense?: Partial<Expense>;
  budgets: any[];
  onSave: (data: Partial<Expense>) => void;
  onCancel: () => void;
}

export const ExpenseForm = ({
  expense,
  budgets,
  onSave,
  onCancel,
}: ExpenseFormProps) => {
  const { t } = useBudtrTranslation();

  const [formData, setFormData] = React.useState<Partial<Expense>>(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      type: expense?.type || ExpenseType.EXPENSE,
      category: expense?.category || ExpenseCategory.FOOD,
      amount: expense?.amount || 0,
      currency: expense?.currency || 'VND',
      source: expense?.source || '',
      description: expense?.description || '',
      createdAt: expense?.createdAt ? expense.createdAt.split('T')[0] : today,
    };
  });

  // Sync form data when expense prop changes
  React.useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      type: expense?.type || ExpenseType.EXPENSE,
      category: expense?.category || ExpenseCategory.FOOD,
      amount: expense?.amount || 0,
      currency: expense?.currency || 'VND',
      source: expense?.source || '',
      description: expense?.description || '',
      createdAt: expense?.createdAt ? expense.createdAt.split('T')[0] : today,
    });
  }, [expense]);

  const handleFieldChange =
    (field: keyof Expense) =>
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
            {t('expenses.type')}
          </Typography>
          <FormControl fullWidth>
            <Select
              value={formData.type || ''}
              onChange={handleFieldChange('type')}
              displayEmpty
            >
              <MenuItem value='' disabled>
                {t('expenses.type')}
              </MenuItem>
              {Object.values(ExpenseType).map(type => (
                <MenuItem key={type} value={type}>
                  {t(`expenses.${type}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 500 }}>
            {t('expenses.amount')}
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
          {t('expenses.category')}
        </Typography>
        <FormControl fullWidth>
          <Select
            value={formData.category || ''}
            onChange={handleFieldChange('category')}
            displayEmpty
          >
            <MenuItem value='' disabled>
              {t('expenses.category')}
            </MenuItem>
            {Object.values(ExpenseCategory).map(category => (
              <MenuItem key={category} value={category}>
                {t(`categories.${category}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box>
        <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 500 }}>
          {t('expenses.source')}
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
                : t('expenses.source')}
            </MenuItem>
            {budgets.map(({ label, value }: any) => (
              <MenuItem value={value} key={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box>
        <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 500 }}>
          {t('expenses.date')}
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
          {t('expenses.description')}
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder={t('expenses.description')}
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
