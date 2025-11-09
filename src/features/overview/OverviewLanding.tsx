import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { AmountInput } from '../../components/AmountInput';
import { ExpenseCategory, ExpenseType } from '../../types/common';
import {
  AUTH_URL,
  categoryOptions,
  expenseOptions,
} from '../../configs/constants';
import { useShellService } from '../../hooks/useShellService';
import { useEffect, useState } from 'react';
import type { ApiClient } from '../../types/shell';
import { CreateExpenseDTO } from '../expenses/dto/CreateExpenseDTO';
import { useBudtrTranslation } from '../../hooks/useI18n';

const DailySpendContainerSx: SxProps = {
  width: 300,
  background: 'white',
  border: `solid 1px ${grey[200]}`,
  borderRadius: 2,
  height: '100%',
  p: 2,
  display: 'flex',
  flexDirection: 'column',
};

const ExpenseContainerSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  overflowY: 'auto',
  flex: 1,
  minHeight: 0,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: grey[100],
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: grey[400],
    borderRadius: '4px',
    '&:hover': {
      background: grey[500],
    },
  },
};

const DEFAULT_FORM_VALUES: CreateExpenseDTO = {
  type: ExpenseType.EXPENSE,
  category: ExpenseCategory.FOOD,
  amount: 0,
  currency: 'VND',
  source: '',
};

export const OverviewLanding = () => {
  // #region Hooks
  const apiClient = useShellService<ApiClient>('apiClient');
  const { t, isReady } = useBudtrTranslation();
  const [budgets, setBudgets] = useState<[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [formData, setFormData] =
    useState<CreateExpenseDTO>(DEFAULT_FORM_VALUES);

  // #region Event handlers
  const handleFieldChange =
    (field: keyof CreateExpenseDTO) => (event: SelectChangeEvent<unknown>) => {
      setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, amount: Number(event.target.value) }));
  };

  const handleSave = async () => {
    if (!apiClient) return;

    try {
      const response = await apiClient.request(`${AUTH_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setFormData(DEFAULT_FORM_VALUES);
    } catch (error) {
      console.error('[OverviewLanding] Failed to save expense:', error);
    }
  };

  const fetchBudgets = async () => {
    if (!apiClient) return;

    try {
      const response = await apiClient.request(`${AUTH_URL}/budgets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error(
        '[OverviewLanding] Failed to fetch budgets:',
        error as Error
      );
    }
  };

  const fetchExpenses = async () => {
    if (!apiClient) return;

    try {
      const response = await apiClient.request(`${AUTH_URL}/expenses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setExpenses(data?.expenses ?? []);
    } catch (error) {
      console.error(
        '[OverviewLanding] Failed to fetch expenses:',
        error as Error
      );
    }
  };

  // #region Effects
  useEffect(() => {
    if (!isReady) return;
    fetchBudgets();
    fetchExpenses();
  }, [apiClient, isReady]);

  return (
    <Box sx={DailySpendContainerSx}>
      <Typography component={'h3'} sx={{ mb: 1.5, color: grey[600] }}>
        {t('overview.dailySpends')}
      </Typography>
      <Box flexDirection='column' gap={1} display={'flex'}>
        <Box gap={1} display='flex'>
          <Select
            sx={{ flex: 1 }}
            value={formData.type}
            onChange={handleFieldChange('type')}
          >
            {expenseOptions.map(({ value }) => (
              <MenuItem value={value} key={value}>
                {t(`expenses.${value}`)}
              </MenuItem>
            ))}
          </Select>
          <Select
            sx={{ flex: 1 }}
            value={formData.category}
            onChange={handleFieldChange('category')}
          >
            {categoryOptions.map(({ value }) => (
              <MenuItem value={value} key={value}>
                {t(`categories.${value}`)}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Select
          sx={{ flex: 1 }}
          value={formData.source}
          onChange={handleFieldChange('source')}
          disabled={budgets?.length <= 0}
          displayEmpty
        >
          <MenuItem value=''>
            {budgets?.length <= 0
              ? t('overview.noBudgetsAvailable')
              : t('overview.selectBudget')}
          </MenuItem>
          {budgets.map(({ label, value }) => (
            <MenuItem value={value} key={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
        <Box gap={1} display='flex'>
          <AmountInput value={formData.amount} onChange={handleAmountChange} />
          <Button
            onClick={handleSave}
            disabled={!apiClient || formData.amount <= 0}
          >
            {t('overview.save')}
          </Button>
        </Box>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box
        sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
      >
        <Typography component={'h4'} sx={{ mb: 1, color: grey[600] }}>
          {t('overview.expenseStats')}
        </Typography>
        {expenses.length === 0 ? (
          <Typography variant='body2' sx={{ color: grey[500] }}>
            {t('overview.noExpenses')}
          </Typography>
        ) : (
          <Box sx={ExpenseContainerSx}>
            {expenses.map((expense, index) => (
              <Box
                key={expense.id || index}
                sx={{
                  p: 1.5,
                  border: `1px solid ${grey[200]}`,
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant='body2' sx={{ fontWeight: 500 }}>
                    {expense.category
                      ? t(`categories.${expense.category}`)
                      : t('categories.OTHER')}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      color:
                        expense.type === ExpenseType.INCOME ? 'green' : 'red',
                      fontWeight: 600,
                    }}
                  >
                    {expense.type === ExpenseType.INCOME ? '+' : '-'}
                    {expense.amount?.toLocaleString() || 0}{' '}
                    {expense.currency || 'VND'}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
