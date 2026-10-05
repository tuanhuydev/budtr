import { Box, List, ListItem, SxProps, Typography } from '@mui/material';

import { CategoryChip } from '@/components/ui/CategoryChip';
import { MoneyText } from '@/components/ui/MoneyText';
import { WidgetCard } from '@/components/ui/WidgetCard';
import { tabularNums } from '@/configs/theme';
import { useStats } from '@/hooks/api/useStats';
import { useBudtrTranslation } from '@/hooks/useI18n';

export const TopTransactions = () => {
  const { t } = useBudtrTranslation();
  const { data: stats, isLoading } = useStats();
  const topTransactions = stats?.topTransactions ?? [];

  return (
    <WidgetCard
      title={t('overview.topTransactions')}
      loading={isLoading}
      empty={
        topTransactions.length === 0 ? t('overview.noTransactions') : undefined
      }
    >
      <List disablePadding>
        {topTransactions.map((tx, index) => (
          <ListItem key={tx.id} sx={ItemSx}>
            <Typography variant='caption' color='text.secondary' sx={RankSx}>
              {index + 1}
            </Typography>
            <Typography variant='body1' noWrap sx={DescriptionSx}>
              {tx.description || t('transactions.noDescription')}
            </Typography>
            <CategoryChip category={tx.category} />
            <Box sx={AmountSx}>
              <MoneyText amount={tx.amount} type={tx.type} />
            </Box>
          </ListItem>
        ))}
      </List>
    </WidgetCard>
  );
};

// Styles
const ItemSx: SxProps = {
  minHeight: 56,
  px: 0,
  gap: 1.5,
  borderTop: '1px solid',
  borderColor: 'divider',
};

const RankSx: SxProps = {
  width: 16,
  flexShrink: 0,
  ...tabularNums,
};

const DescriptionSx: SxProps = {
  flex: 1,
  minWidth: 0,
  fontWeight: 500,
};

const AmountSx: SxProps = {
  minWidth: 88,
  textAlign: 'right',
  flexShrink: 0,
};
