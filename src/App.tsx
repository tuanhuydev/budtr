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
import { getStorage, initStorage } from './utils/storage';

const TAB_IDS = ['overview', 'transactions', 'asset'] as const;

const readStoredTab = () => getStorage(TAB_IDS.length).get('activeTab');

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
    getStorage(TAB_IDS.length).set('activeTab', next);
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

interface AppProps {
  /** Capability the shell issues for budtr's storage slice. */
  storageGrant?: string;
}

const App: React.FC<AppProps> = ({ storageGrant }) => {
  initStorage(storageGrant);
  return (
    <QueryProvider>
      <ThemeProvider>
        <Content />
      </ThemeProvider>
    </QueryProvider>
  );
};

export default App;

// Styles
const RootSx: SxProps = {
  containerType: 'inline-size',
  bgcolor: 'background.default',
  p: { xs: '12px 12px 20px', sm: '16px 20px 32px', md: '32px 40px 48px' },
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const ContentCardSx: SxProps = {
  overflow: 'hidden',
};
