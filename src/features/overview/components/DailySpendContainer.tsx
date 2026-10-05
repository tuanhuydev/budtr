import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  SxProps,
  Typography,
} from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';

import { AmountInput } from '@/components/AmountInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { MoneyText } from '@/components/ui/MoneyText';
import { WidgetCard } from '@/components/ui/WidgetCard';
import {
  CATEGORY_COLORS,
  categoryOptions,
  transactionOptions,
} from '@/configs/constants';
import { CreateTransactionDTO } from '@/features/transactions/dto/CreateTransactionDTO';
import {
  useCreateTransaction,
  useTransactionSuggestions,
} from '@/hooks/api/useTransactions';
import { useBudtrTranslation } from '@/hooks/useI18n';
import { Asset } from '@/types/asset';
import {
  DropdownOption,
  ExpenseBehavior,
  ExpenseCategory,
  ExpenseType,
} from '@/types/common';
import { Transaction } from '@/types/transaction';

const DEFAULT_FORM_VALUES: CreateTransactionDTO = {
  type: ExpenseType.EXPENSE,
  category: ExpenseCategory.FOOD,
  amount: 0,
  currency: 'VND',
  source: '',
  behavior: ExpenseBehavior.FIXED,
};

const SUGGESTION_DEBOUNCE_MS = 400;

interface DailySpendContainerProps {
  transactions: Transaction[];
  assets: Asset[];
}

export const DailySpendContainer = ({
  transactions,
  assets,
}: DailySpendContainerProps) => {
  const { t } = useBudtrTranslation();
  const createTransactionMutation = useCreateTransaction();

  const [formData, setFormData] =
    useState<CreateTransactionDTO>(DEFAULT_FORM_VALUES);
  const [debouncedAmount, setDebouncedAmount] = useState(0);
  const [suggestionsDismissed, setSuggestionsDismissed] = useState(false);

  useEffect(() => {
    const id = setTimeout(
      () => setDebouncedAmount(formData.amount),
      SUGGESTION_DEBOUNCE_MS
    );
    return () => clearTimeout(id);
  }, [formData.amount]);

  useEffect(() => {
    setSuggestionsDismissed(false);
  }, [debouncedAmount]);

  const { data: comboSuggestions = [] } = useTransactionSuggestions({
    amount: debouncedAmount,
    type: formData.type,
  });

  const showSuggestions =
    !suggestionsDismissed &&
    formData.amount === debouncedAmount &&
    comboSuggestions.length > 0;

  const handleFieldChange =
    (field: keyof CreateTransactionDTO) =>
    (event: SelectChangeEvent<unknown>) => {
      setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, amount: Number(event.target.value) }));
  };

  const handleSuggestionSelect = (
    category: string,
    behavior: string,
    description?: string
  ) => {
    setFormData(prev => ({
      ...prev,
      category: category as ExpenseCategory,
      behavior: behavior as ExpenseBehavior,
      description: description || prev.description,
    }));
    setSuggestionsDismissed(true);
  };

  const handleSave = async () => {
    try {
      await createTransactionMutation.mutateAsync(formData);
      setFormData(DEFAULT_FORM_VALUES);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[DailySpendContainer] Failed to save transaction', error);
    }
  };
  const ExpenseBehaviorOptions: Array<DropdownOption<ExpenseBehavior>> = [
    {
      label: t(`transactions.${ExpenseBehavior.FIXED}`),
      value: ExpenseBehavior.FIXED,
    },
    {
      label: t(`transactions.${ExpenseBehavior.VARIABLE}`),
      value: ExpenseBehavior.VARIABLE,
    },
  ];

  const labelled = (label: string, control: ReactNode) => (
    <Box sx={FieldSx}>
      <Typography variant='caption' color='text.secondary'>
        {label}
      </Typography>
      {control}
    </Box>
  );

  const categoryDot = (category: string) => (
    <Box
      sx={{
        ...CategoryDotSx,
        bgcolor: CATEGORY_COLORS[category] ?? CATEGORY_COLORS.OTHER,
      }}
    />
  );

  return (
    <WidgetCard title={t('overview.dailySpends')}>
      <Box sx={ColumnsSx}>
        <Box sx={FormColumnSx}>
          <Box sx={SelectGridSx}>
            {labelled(
              t('transactions.type'),
              <Select
                fullWidth
                value={formData.type}
                onChange={handleFieldChange('type')}
              >
                {transactionOptions.map(({ value }) => (
                  <MenuItem value={value} key={value}>
                    {t(`transactions.${value}`)}
                  </MenuItem>
                ))}
              </Select>
            )}
            {labelled(
              t('transactions.category'),
              <Select
                fullWidth
                value={formData.category}
                onChange={handleFieldChange('category')}
                renderValue={value => (
                  <Box sx={CategoryValueSx}>
                    {categoryDot(String(value))}
                    {t(`categories.${value}`)}
                  </Box>
                )}
              >
                {categoryOptions.map(({ value }) => (
                  <MenuItem value={value} key={value} sx={CategoryValueSx}>
                    {categoryDot(value)}
                    {t(`categories.${value}`)}
                  </MenuItem>
                ))}
              </Select>
            )}
            {labelled(
              t('transactions.source'),
              <Select
                fullWidth
                value={formData.source}
                onChange={handleFieldChange('source')}
                disabled={assets?.length <= 0}
                displayEmpty
              >
                <MenuItem value=''>
                  {assets?.length <= 0
                    ? t('overview.noSourcesAvailable')
                    : t('overview.selectSource')}
                </MenuItem>
                {assets.map(asset => (
                  <MenuItem value={asset.id} key={asset.id}>
                    {asset.name}
                  </MenuItem>
                ))}
              </Select>
            )}
            {labelled(
              t('transactions.behavior'),
              <Select
                fullWidth
                value={formData.behavior}
                onChange={handleFieldChange('behavior')}
              >
                {ExpenseBehaviorOptions.map(option => (
                  <MenuItem value={option.value} key={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Box>
          <Box sx={AmountFieldContainerSx}>
            <Box sx={AmountRowSx}>
              <AmountInput
                value={formData.amount}
                onChange={handleAmountChange}
                sx={{ flex: 1 }}
              />
              <Button
                onClick={handleSave}
                disabled={
                  createTransactionMutation.isPending || formData.amount <= 0
                }
              >
                {t('common.save')}
              </Button>
            </Box>
            {showSuggestions && (
              <Paper sx={SuggestionsDropdownSx} elevation={3}>
                <List dense disablePadding>
                  {comboSuggestions.map(suggestion => {
                    return (
                      <ListItemButton
                        key={`${suggestion.category}-${suggestion.behavior}`}
                        onClick={() =>
                          handleSuggestionSelect(
                            suggestion.category,
                            suggestion.behavior,
                            suggestion.description
                          )
                        }
                        sx={SuggestionItemSx}
                      >
                        {categoryDot(suggestion.category)}
                        <ListItemText
                          sx={SuggestionTextSx}
                          primary={`${t(`categories.${suggestion.category}`)} · ${t(`transactions.${suggestion.behavior}`)}`}
                          secondary={suggestion.description || undefined}
                          slotProps={{
                            primary: { variant: 'body2', fontWeight: 600 },
                            secondary: {
                              variant: 'caption',
                              sx: TruncatedTextSx,
                            },
                          }}
                        />
                        <MoneyText
                          variant='body2'
                          amount={debouncedAmount}
                          type={formData.type}
                          currency={formData.currency}
                          sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Paper>
            )}
          </Box>
        </Box>
        <Box sx={ListColumnSx}>
          <Typography component='h3' variant='h3'>
            {t('overview.transactionList')}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {t('overview.today')}
          </Typography>
          {transactions.length === 0 ? (
            <EmptyState message={t('overview.noTransactions')} />
          ) : (
            <Box sx={TransactionListSx}>
              {transactions.map((transaction, index) => (
                <Box key={transaction.id || index} sx={TransactionItemSx}>
                  <Typography variant='body1' sx={{ fontWeight: 500 }}>
                    {transaction.category
                      ? t(`categories.${transaction.category}`)
                      : t('categories.OTHER')}
                  </Typography>
                  <MoneyText
                    amount={transaction.amount || 0}
                    type={transaction.type}
                    currency={transaction.currency || 'VND'}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </WidgetCard>
  );
};

// Styles
const ColumnsSx: SxProps = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 3,
};

const FormColumnSx: SxProps = {
  flex: '1 1 260px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
};

const ListColumnSx: SxProps = {
  flex: '1 1 260px',
  minWidth: 0,
  borderTop: { xs: '1px solid', md: 'none' },
  borderLeft: { md: '1px solid' },
  borderColor: 'divider',
  pt: { xs: 3, md: 0 },
  pl: { md: 3 },
  display: 'flex',
  flexDirection: 'column',
};

const SelectGridSx: SxProps = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 1.5,
};

const FieldSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
  minWidth: 0,
};

const AmountRowSx: SxProps = {
  display: 'flex',
  gap: 1,
};

const CategoryValueSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

const AmountFieldContainerSx: SxProps = {
  position: 'relative',
};

const SuggestionsDropdownSx: SxProps = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  mt: 0.5,
  zIndex: 10,
  maxHeight: 240,
  overflowY: 'auto',
  border: '1px solid',
  borderColor: 'divider',
};

const SuggestionItemSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

const CategoryDotSx: SxProps = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  flexShrink: 0,
};

const SuggestionTextSx: SxProps = {
  flex: 1,
  minWidth: 0,
  mr: 1,
};

const TruncatedTextSx: SxProps = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const TransactionListSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  mt: 1,
  maxHeight: 300,
  overflowY: 'auto',
};

const TransactionItemSx: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 1,
  minHeight: 48,
  borderTop: '1px solid',
  borderColor: 'divider',
};
