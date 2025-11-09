import React, {
  FC,
  Fragment,
  PropsWithChildren,
  SyntheticEvent,
  useState,
} from 'react';

import { Box, Tab, Tabs } from '@mui/material';

import { TabContainer } from './components/PageContainer';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { OverviewLanding } from './features/overview/OverviewLanding';
import { grey } from '@mui/material/colors';
import { useBudtrTranslation } from './hooks/useI18n';

const TabWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      sx={{
        bgcolor: grey[50],
        p: 2,
        borderRadius: 1,
        height: 'calc(100vh - 96px)',
        overflow: 'auto',
      }}
    >
      {children}
    </Box>
  );
};
const App: React.FC = () => {
  const { t } = useBudtrTranslation();
  const [activeTab, setActiveTab] = useState<number>(0);
  const handleChange = (e: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  return (
    <ThemeProvider>
      {/* Tab Navigation */}
      <Tabs
        value={activeTab}
        onChange={handleChange}
        aria-label='budtr-aria'
        sx={{
          background: 'background.paper',
        }}
      >
        <Tab
          label={t('tabs.overview')}
          sx={{ background: 'background.paper' }}
        />
        <Tab label={t('tabs.expense')} />
        <Tab label={t('tabs.budgets')} />
      </Tabs>

      {/* Tab Content */}
      <Fragment>
        <TabContainer value={activeTab} index={0}>
          <TabWrapper>
            <OverviewLanding />
          </TabWrapper>
        </TabContainer>
        <TabContainer value={activeTab} index={1}>
          <TabWrapper>
            <h3>Expense Content</h3>
            <p>Test theme colors here.</p>
          </TabWrapper>
        </TabContainer>
        <TabContainer value={activeTab} index={2}>
          <TabWrapper>
            <h3>Budget Content</h3>
            <p>Theme testing area.</p>
          </TabWrapper>
        </TabContainer>
      </Fragment>
    </ThemeProvider>
  );
};

export default App;
