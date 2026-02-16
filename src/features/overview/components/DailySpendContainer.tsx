import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useState } from 'react';

import { AmountInput } from '@/components/AmountInput';
import { categoryOptions, expenseOptions } from '@/configs/constants';
import { CreateExpenseDTO } from '@/features/expenses/dto/CreateExpenseDTO';
import { useCreateExpense } from '@/hooks/api/useExpenses';
import { useBudtrTranslation } from '@/hooks/useI18n';
import {
  DropdownOption,
  ExpenseBehavior,
  ExpenseCategory,
  ExpenseType,
} from '@/types/common';
import { Expense } from '@/types/expense';
import { formatExpenseAmount } from '@/utils/expenseFormatter';

const DEFAULT_FORM_VALUES: CreateExpenseDTO = {
  type: ExpenseType.EXPENSE,
  category: ExpenseCategory.FOOD,
  amount: 0,
  currency: 'VND',
  source: '',
  behavior: ExpenseBehavior.FIXED,
};

interface DailySpendContainerProps {
  expenses: Expense[];
  budgets: any[];
}

export const DailySpendContainer = ({
  expenses,
  budgets,
}: DailySpendContainerProps) => {
  const { t } = useBudtrTranslation();
  const createExpenseMutation = useCreateExpense();

  const [formData, setFormData] =
    useState<CreateExpenseDTO>(DEFAULT_FORM_VALUES);

  const handleFieldChange =
    (field: keyof CreateExpenseDTO) => (event: SelectChangeEvent<unknown>) => {
      setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, amount: Number(event.target.value) }));
  };

  const handleSave = async () => {
    try {
      await createExpenseMutation.mutateAsync(formData);
      setFormData(DEFAULT_FORM_VALUES);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[DailySpendContainer] Failed to save expense', error);
    }
  };
  const ExpenseBehaviorOptions: Array<DropdownOption<ExpenseBehavior>> = [
    {
      label: t(`expenses.${ExpenseBehavior.FIXED}`),
      value: ExpenseBehavior.FIXED,
    },
    {
      label: t(`expenses.${ExpenseBehavior.VARIABLE}`),
      value: ExpenseBehavior.VARIABLE,
    },
  ];

  return (
    <Box sx={ContainerSx}>
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
        <Box display='flex' gap={1}>
          <Select
            sx={{ flex: 1 }}
            size='small'
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
          <Select
            sx={{ width: 200 }}
            size='small'
            value={formData.behavior}
            onChange={handleFieldChange('behavior')}
          >
            {ExpenseBehaviorOptions.map(option => (
              <MenuItem value={option.value} key={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box gap={1} display='flex'>
          <AmountInput
            value={formData.amount}
            onChange={handleAmountChange}
            sx={{ flex: 1 }}
          />
          <Button
            onClick={handleSave}
            disabled={createExpenseMutation.isPending || formData.amount <= 0}
          >
            {t('common.save')}
          </Button>
        </Box>
      </Box>
      <Box sx={ExpensesContainerSx}>
        <Typography component={'h4'} sx={{ mb: 1, color: grey[600] }}>
          {t('overview.expenseList')}
        </Typography>
        {expenses.length === 0 ? (
          <Typography variant='body2' sx={{ color: grey[500] }}>
            {t('overview.noExpenses')}
          </Typography>
        ) : (
          <Box sx={ExpenseListSx}>
            {expenses.map((expense, index) => (
              <Box key={expense.id || index} sx={ExpenseItemSx}>
                <Box sx={ExpenseItemContentSx}>
                  <Typography variant='body2' sx={{ fontWeight: 500 }}>
                    {expense.category
                      ? t(`categories.${expense.category}`)
                      : t('categories.OTHER')}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      color: formatExpenseAmount(
                        expense.amount || 0,
                        expense.type,
                        expense.currency || 'VND'
                      ).color,
                      fontWeight: 600,
                    }}
                  >
                    {
                      formatExpenseAmount(
                        expense.amount || 0,
                        expense.type,
                        expense.currency || 'VND'
                      ).displayText
                    }
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

// Styles
const ContainerSx: SxProps = {
  width: { xs: '100%', md: 400 },
  background: 'white',
  border: `solid 1px ${grey[200]}`,
  borderRadius: 2,
  p: 2,
  display: 'flex',
  flexDirection: 'column',
};

const ExpenseListSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  overflowY: 'auto',
  flex: 1,
  maxHeight: 'calc(100% - 100px)',
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

const ExpensesContainerSx: SxProps = {
  flex: 1,
  minHeight: 0,
  mt: 2,
  display: 'flex',
  flexDirection: 'column',
};

const ExpenseItemSx: SxProps = {
  p: 1.5,
  border: `1px solid ${grey[200]}`,
  borderRadius: 1,
};

const ExpenseItemContentSx: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};
