import { Box, Paper, SxProps } from '@mui/material';
import React, { useState } from 'react';

import { BudtrHeader } from './components/layout/BudtrHeader';
import { PageTabs } from './components/layout/PageTabs';
import { TabContainer } from './components/PageContainer';
import { QueryProvider } from './components/providers/QueryProvider';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { AssetManagementLanding } from './features/assets/AssetManagementLanding';
import { OverviewLanding } from './features/overview/OverviewLanding';
import { TransactionLanding } from './features/transactions/TransactionLanding';
import { useBudtrTranslation } from './hooks/useI18n';

const TAB_STORAGE_KEY = 'budtr:active-tab';

const TAB_IDS = ['overview', 'transactions', 'asset'] as const;

const readStoredTab = () => {
  try {
    const stored = Number(window.sessionStorage.getItem(TAB_STORAGE_KEY));
    return Number.isInteger(stored) && stored >= 0 && stored < TAB_IDS.length
      ? stored
      : 0;
  } catch {
    return 0;
  }
};

const Content: React.FC = () => {
  const { t } = useBudtrTranslation();
  const [activeTab, setActiveTab] = useState<number>(readStoredTab);
  // Panels mount on first visit and stay mounted afterwards.
  const [visited, setVisited] = useState<Set<number>>(
    () => new Set([readStoredTab()])
  );

  const handleChange = (next: number) => {
    setActiveTab(next);
    setVisited(prev => new Set(prev).add(next));
    try {
      window.sessionStorage.setItem(TAB_STORAGE_KEY, String(next));
    } catch {
      // storage unavailable: the tab just is not remembered
    }
  };

  const tabs = [
    { id: 'overview', label: t('tabs.overview'), content: <OverviewLanding /> },
    {
      id: 'transactions',
      label: t('tabs.transactions'),
      content: <TransactionLanding />,
    },
    {
      id: 'asset',
      label: t('tabs.asset'),
      content: <AssetManagementLanding />,
    },
  ];

  return (
    <Box sx={RootSx}>
      <BudtrHeader />
      <Paper variant='outlined' sx={ContentCardSx}>
        <PageTabs
          tabs={tabs}
          value={activeTab}
          onChange={handleChange}
          ariaLabel='budtr-aria'
        />
        {tabs.map((tab, index) => (
          <TabContainer
            key={tab.id}
            id={tab.id}
            value={activeTab}
            index={index}
          >
            {visited.has(index) ? tab.content : null}
          </TabContainer>
        ))}
      </Paper>
    </Box>
  );
};

const App: React.FC = () => (
  <QueryProvider>
    <ThemeProvider>
      <Content />
    </ThemeProvider>
  </QueryProvider>
);

export default App;

// Styles
const RootSx: SxProps = {
  containerType: 'inline-size',
  bgcolor: 'background.default',
  p: { xs: '16px 16px 24px', md: '32px 40px 48px' },
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const ContentCardSx: SxProps = {
  overflow: 'hidden',
};
