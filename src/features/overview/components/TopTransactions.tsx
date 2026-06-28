import { Box, SxProps, Typography, List, ListItem, Chip } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useMemo } from 'react';

import { CATEGORY_COLORS } from '@/configs/constants';
import { useStats } from '@/hooks/api/useStats';
import { useBudtrTranslation } from '@/hooks/useI18n';
import { formatTransactionAmount } from '@/utils/transactionFormatter';

export const TopTransactions = () => {
  const { t } = useBudtrTranslation();
  const { data: stats } = useStats();

  const topTransactions = stats?.topTransactions || [];

  const formattedTransactions = useMemo(() => {
    return topTransactions.map(transaction => ({
      ...transaction,
      formattedAmount: formatTransactionAmount(
        transaction.amount,
        transaction.type
      ).displayText,
      categoryLabel: t(`categories.${transaction.category}`),
      categoryColor:
        CATEGORY_COLORS[transaction.category] || CATEGORY_COLORS.OTHER,
    }));
  }, [topTransactions, t]);

  if (!topTransactions || topTransactions.length === 0) {
    return (
      <Box sx={ContainerSx}>
        <Typography variant='body2' sx={TitleSx}>
          {t('overview.topTransactions')}
        </Typography>

        <Box sx={EmptyStateSx}>
          <Typography variant='body2' sx={{ color: grey[500] }}>
            {t('overview.noTransactions')}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={ContainerSx}>
      <Typography component='h3' sx={TitleSx}>
        {t('overview.topTransactions')}
      </Typography>

      <List sx={ListSx}>
        {formattedTransactions.map((transaction, index) => (
          <ListItem
            key={transaction.id}
            sx={{
              ...ListItemSx,
              borderBottom:
                index < formattedTransactions.length - 1
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
                  {transaction.description || t('transactions.noDescription')}
                </Typography>
                <Chip
                  label={transaction.categoryLabel}
                  size='small'
                  sx={{
                    backgroundColor: transaction.categoryColor,
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
                {transaction.formattedAmount}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

// Styles
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
