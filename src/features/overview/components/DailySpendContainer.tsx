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
import { grey } from '@mui/material/colors';
import { useEffect, useState } from 'react';

import { AmountInput } from '@/components/AmountInput';
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
import { formatTransactionAmount } from '@/utils/transactionFormatter';

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

  return (
    <Box sx={ContainerSx}>
      <Typography component='h3' sx={TitleSx}>
        {t('overview.dailySpends')}
      </Typography>
      <Box flexDirection='column' gap={1} display={'flex'}>
        <Box gap={1} display='flex'>
          <Select
            sx={{ flex: 1 }}
            value={formData.type}
            onChange={handleFieldChange('type')}
          >
            {transactionOptions.map(({ value }) => (
              <MenuItem value={value} key={value}>
                {t(`transactions.${value}`)}
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
        <Box sx={AmountFieldContainerSx}>
          <Box gap={1} display='flex'>
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
                  const formattedAmount = formatTransactionAmount(
                    debouncedAmount,
                    formData.type,
                    formData.currency
                  );
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
                      <Box
                        sx={{
                          ...CategoryDotSx,
                          bgcolor:
                            CATEGORY_COLORS[suggestion.category] ??
                            CATEGORY_COLORS.OTHER,
                        }}
                      />
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
                      <Typography
                        variant='body2'
                        sx={{
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          color:
                            formattedAmount.color === 'green'
                              ? 'success.main'
                              : formattedAmount.color === 'grey'
                                ? 'text.secondary'
                                : 'error.main',
                        }}
                      >
                        {formattedAmount.displayText}
                      </Typography>
                    </ListItemButton>
                  );
                })}
              </List>
            </Paper>
          )}
        </Box>
      </Box>
      <Box sx={TransactionsContainerSx}>
        <Typography component={'h4'} sx={{ mb: 1, color: grey[600] }}>
          {t('overview.transactionList')}
        </Typography>
        {transactions.length === 0 ? (
          <Typography variant='body2' sx={{ color: grey[500] }}>
            {t('overview.noTransactions')}
          </Typography>
        ) : (
          <Box sx={TransactionListSx}>
            {transactions.map((transaction, index) => (
              <Box key={transaction.id || index} sx={TransactionItemSx}>
                <Box sx={TransactionItemContentSx}>
                  <Typography variant='body2' sx={{ fontWeight: 500 }}>
                    {transaction.category
                      ? t(`categories.${transaction.category}`)
                      : t('categories.OTHER')}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      color: formatTransactionAmount(
                        transaction.amount || 0,
                        transaction.type,
                        transaction.currency || 'VND'
                      ).color,
                      fontWeight: 600,
                    }}
                  >
                    {
                      formatTransactionAmount(
                        transaction.amount || 0,
                        transaction.type,
                        transaction.currency || 'VND'
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
};

const SuggestionItemSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

const CategoryDotSx: SxProps = {
  width: 10,
  height: 10,
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

const TitleSx: SxProps = {
  fontWeight: 600,
  mb: 1,
};

const ContainerSx: SxProps = {
  width: { xs: '100%', md: 400 },
  height: 400,
  background: 'white',
  border: `solid 1px ${grey[200]}`,
  borderRadius: 2,
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const TransactionListSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  overflowY: 'auto',
  flex: 1,
  maxHeight: 300,
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

const TransactionsContainerSx: SxProps = {
  flex: 1,
  minHeight: 0,
  mt: 2,
  display: 'flex',
  flexDirection: 'column',
};

const TransactionItemSx: SxProps = {
  p: 1.5,
  border: `1px solid ${grey[200]}`,
  borderRadius: 1,
};

const TransactionItemContentSx: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};
