import { Box, SxProps, Typography, List, ListItem, Chip } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useMemo } from 'react';

import { CATEGORY_COLORS } from '@/configs/constants';
import { useStats } from '@/hooks/api/useStats';
import { useBudtrTranslation } from '@/hooks/useI18n';
import { formatExpenseAmount } from '@/utils/expenseFormatter';

export const TopExpenses = () => {
  const { t } = useBudtrTranslation();
  const { data: stats } = useStats();

  const topExpenses = stats?.topExpenses || [];

  const formattedExpenses = useMemo(() => {
    return topExpenses.map(expense => ({
      ...expense,
      formattedAmount: formatExpenseAmount(expense.amount, expense.type)
        .displayText,
      categoryLabel: t(`categories.${expense.category}`),
      categoryColor: CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.OTHER,
    }));
  }, [topExpenses, t]);

  if (!topExpenses || topExpenses.length === 0) {
    return (
      <Box sx={ContainerSx}>
        <Typography component={'h3'} sx={{ mb: 1.5, color: grey[600] }}>
          {t('overview.topExpenses')}
        </Typography>

        <Box sx={EmptyStateSx}>
          <Typography variant='body2' sx={{ color: grey[500] }}>
            {t('overview.noExpenses')}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={ContainerSx}>
      <Typography component={'h3'} sx={{ mb: 1.5, color: grey[600] }}>
        {t('overview.topExpenses')}
      </Typography>

      <List sx={ListSx}>
        {formattedExpenses.map((expense, index) => (
          <ListItem
            key={expense.id}
            sx={{
              ...ListItemSx,
              borderBottom:
                index < formattedExpenses.length - 1
                  ? `1px solid ${grey[200]}`
                  : 'none',
            }}
          >
            <Box sx={ListItemContentSx}>
              <Box sx={DescriptionBoxSx}>
                <Typography
                  variant='body2'
                  sx={{ fontWeight: 500, color: grey[800] }}
                >
                  {expense.description || t('expenses.noDescription')}
                </Typography>
                <Chip
                  label={expense.categoryLabel}
                  size='small'
                  sx={{
                    backgroundColor: expense.categoryColor,
                    color: 'white',
                    fontSize: '0.7rem',
                    height: '20px',
                  }}
                />
              </Box>
              <Typography
                variant='body1'
                sx={{ fontWeight: 'bold', color: grey[900], flexShrink: 0 }}
              >
                {expense.formattedAmount}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

// Styles
const ContainerSx: SxProps = {
  width: { xs: '100%', md: 400 },
  height: 400,
  background: 'white',
  border: `solid 1px ${grey[200]}`,
  borderRadius: 2,
  p: 2,
  display: 'flex',
  flexDirection: 'column',
};

const EmptyStateSx: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
};

const ListSx: SxProps = {
  width: '100%',
  overflow: 'auto',
  p: 0,
};

const ListItemSx: SxProps = {
  py: 1.5,
  px: 0,
};

const ListItemContentSx: SxProps = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 1,
};

const DescriptionBoxSx: SxProps = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 1,
  flex: 1,
  minWidth: 0, // Allow text truncation
};
