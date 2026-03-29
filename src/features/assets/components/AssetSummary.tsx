import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, IconButton, SxProps, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useMemo, useState } from 'react';

import { HIDDEN_BALANCE_PATTERN } from '@/configs/constants';
import { useBudtrTranslation } from '@/hooks/useI18n';
import { Asset, AssetType } from '@/types/asset';

const ASSET_TYPE_COLOR: Record<AssetType, string> = {
  [AssetType.CASH]: '#4caf50',
  [AssetType.BANK]: '#2196f3',
  [AssetType.INVESTMENT]: '#ff9800',
  [AssetType.PHYSICAL]: '#9c27b0',
};

interface AssetSummaryProps {
  assets: Asset[];
}

export const AssetSummary = ({ assets }: AssetSummaryProps) => {
  const { t } = useBudtrTranslation();
  const [showBalances, setShowBalances] = useState(false);

  const { totalBalance, typeBreakdown, defaultCurrency } = useMemo(() => {
    let totalBalance = 0;
    const assetsByType: Record<
      AssetType,
      { count: number; balance: number; currency: string }
    > = {
      [AssetType.CASH]: { count: 0, balance: 0, currency: 'VND' },
      [AssetType.BANK]: { count: 0, balance: 0, currency: 'VND' },
      [AssetType.INVESTMENT]: { count: 0, balance: 0, currency: 'VND' },
      [AssetType.PHYSICAL]: { count: 0, balance: 0, currency: 'VND' },
    };

    // Determine most common currency
    const currencyCounts: Record<string, number> = {};
    for (const asset of assets) {
      const curr = asset.currency || 'VND';
      currencyCounts[curr] = (currencyCounts[curr] || 0) + 1;
    }
    const defaultCurrency =
      Object.entries(currencyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      'VND';

    for (const asset of assets) {
      totalBalance += asset.currentBalance;
      assetsByType[asset.type].count += 1;
      assetsByType[asset.type].balance += asset.currentBalance;
      // Use asset's currency or default
      if (!assetsByType[asset.type].currency || asset.currency) {
        assetsByType[asset.type].currency = asset.currency || 'VND';
      }
    }

    const typeBreakdown = Object.entries(assetsByType)
      .filter(([_, data]) => data.count > 0)
      .map(([type, data]) => ({
        type: type as AssetType,
        count: data.count,
        balance: data.balance,
        currency: data.currency,
      }))
      .sort((a, b) => b.balance - a.balance);

    return { totalBalance, typeBreakdown, defaultCurrency };
  }, [assets]);

  if (assets.length === 0) {
    return (
      <Box sx={ContainerSx}>
        <Box sx={TitleContainerSx}>
          <Typography component='h3' sx={TitleSx}>
            {t('assets.summary')}
          </Typography>
          <IconButton
            size='small'
            onClick={() => setShowBalances(!showBalances)}
            aria-label={showBalances ? 'Hide balances' : 'Show balances'}
          >
            {showBalances ? (
              <VisibilityOff fontSize='small' />
            ) : (
              <Visibility fontSize='small' />
            )}
          </IconButton>
        </Box>
        <Box sx={EmptyStateSx}>
          <Typography variant='body2' sx={{ color: grey[500] }}>
            {t('assets.noAssets')}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={ContainerSx}>
      <Box sx={TitleContainerSx}>
        <Typography component='h3' sx={TitleSx}>
          {t('assets.summary')}
        </Typography>
        <IconButton
          size='small'
          onClick={() => setShowBalances(!showBalances)}
          aria-label={showBalances ? 'Hide balances' : 'Show balances'}
        >
          {showBalances ? (
            <VisibilityOff fontSize='small' />
          ) : (
            <Visibility fontSize='small' />
          )}
        </IconButton>
      </Box>

      {/* Total Balance */}
      <Box sx={TotalsSx}>
        <Box sx={TotalRowSx}>
          <Typography variant='body2' sx={{ color: grey[600] }}>
            {t('assets.totalAssets')}
          </Typography>
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            {assets.length}
          </Typography>
        </Box>
        <Box sx={DividerSx} />
        <Box sx={TotalRowSx}>
          <Typography variant='body2' sx={{ fontWeight: 700 }}>
            {t('assets.totalBalance')}
          </Typography>
          <Typography
            variant='body2'
            sx={{ fontWeight: 700, color: 'primary.main' }}
          >
            {showBalances
              ? `${totalBalance.toLocaleString()} ${defaultCurrency}`
              : HIDDEN_BALANCE_PATTERN}
          </Typography>
        </Box>
      </Box>

      {/* Type Breakdown */}
      {typeBreakdown.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
            {t('assets.byType')}
          </Typography>
          {typeBreakdown.map(({ type, count, balance, currency }) => (
            <Box key={type} sx={TypeRowSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    ...ColorDotSx,
                    backgroundColor: ASSET_TYPE_COLOR[type],
                  }}
                />
                <Box>
                  <Typography variant='body2'>
                    {t(`assets.type.${type}`)}
                  </Typography>
                  <Typography variant='caption' sx={{ color: grey[500] }}>
                    {count}{' '}
                    {count === 1 ? t('assets.asset') : t('assets.assets')}
                  </Typography>
                </Box>
              </Box>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                {showBalances
                  ? `${balance.toLocaleString()} ${currency}`
                  : HIDDEN_BALANCE_PATTERN}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

// Styles
const ContainerSx: SxProps = {
  width: { xs: '100%', md: 300 },
  minHeight: 200,
  background: 'white',
  border: `solid 1px ${grey[200]}`,
  borderRadius: 2,
  p: 2,
  display: 'flex',
  flexDirection: 'column',
};

const TitleContainerSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb: 1.5,
};

const TitleSx: SxProps = {
  color: grey[600],
  mb: 0,
};

const EmptyStateSx: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
};

const TotalsSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

const TotalRowSx: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const DividerSx: SxProps = {
  borderTop: `1px solid ${grey[300]}`,
  my: 0.5,
};

const TypeRowSx: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  py: 0.5,
  gap: 1,
};

const ColorDotSx: SxProps = {
  width: 10,
  height: 10,
  borderRadius: '50%',
};
