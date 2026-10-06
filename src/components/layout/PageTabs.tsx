import { Box, SxProps, Tab, Tabs } from '@mui/material';
import { SyntheticEvent } from 'react';

import { AssetIcon, OverviewIcon, TransactionsIcon } from '../icons/TabIcons';

export interface PageTabItem {
  id: string;
  label: string;
}

const ICONS: Record<string, typeof OverviewIcon> = {
  overview: OverviewIcon,
  transactions: TransactionsIcon,
  asset: AssetIcon,
};

interface PageTabsProps {
  tabs: PageTabItem[];
  value: number;
  onChange: (index: number) => void;
  ariaLabel: string;
}

export const PageTabs = ({
  tabs,
  value,
  onChange,
  ariaLabel,
}: PageTabsProps) => (
  <Box sx={BarSx}>
    <Tabs
      value={value}
      onChange={(_: SyntheticEvent, next: number) => onChange(next)}
      variant='scrollable'
      scrollButtons={false}
      aria-label={ariaLabel}
    >
      {tabs.map((tab, index) => {
        const Icon = ICONS[tab.id];
        return (
          <Tab
            key={tab.id}
            id={`budtr-tab-${tab.id}`}
            aria-controls={`budtr-tabpanel-${tab.id}`}
            label={tab.label}
            icon={Icon ? <Icon sx={{ fontSize: 20 }} /> : undefined}
            iconPosition='start'
            value={index}
          />
        );
      })}
    </Tabs>
  </Box>
);

// Styles
const BarSx: SxProps = {
  p: { xs: '8px 8px 0', sm: '12px 16px 0', md: '12px 20px 0' },
  borderBottom: '1px solid',
  borderColor: 'divider',
};
