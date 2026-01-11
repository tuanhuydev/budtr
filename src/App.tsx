import { Box, SxProps, Tab, Tabs } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, {
  FC,
  Fragment,
  PropsWithChildren,
  SyntheticEvent,
  useState,
} from 'react';

import { TabContainer } from './components/PageContainer';
import { QueryProvider } from './components/providers/QueryProvider';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { ExpenseLanding } from './features/expenses/ExpenseLanding';
import { OverviewLanding } from './features/overview/OverviewLanding';
import { useBudtrTranslation } from './hooks/useI18n';

const TabWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <Box sx={TabWrapperSx}>{children}</Box>;
};

const App: React.FC = () => {
  const { t } = useBudtrTranslation();
  const [activeTab, setActiveTab] = useState<number>(0);
  const handleChange = (e: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const tabs = [
    {
      labelKey: 'tabs.overview',
      content: <OverviewLanding />,
    },
    {
      labelKey: 'tabs.expense',
      content: <ExpenseLanding />,
    },
    {
      labelKey: 'tabs.budgets',
      content: (
        <div>
          <h3>Budget Content</h3>
          <p>Theme testing area.</p>
        </div>
      ),
    },
  ];

  return (
    <QueryProvider>
      <ThemeProvider>
        {/* Tab Navigation */}
        <Tabs value={activeTab} onChange={handleChange} aria-label='budtr-aria'>
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={t(tab.labelKey)}
              id={`tab-${index}`}
              aria-controls={`tabpanel-${index}`}
              sx={{ background: 'background.paper' }}
            />
          ))}
        </Tabs>

        {/* Tab Content */}
        <Fragment>
          {tabs.map((tab, index) => (
            <TabContainer key={index} value={activeTab} index={index}>
              <TabWrapper>{tab.content}</TabWrapper>
            </TabContainer>
          ))}
        </Fragment>
      </ThemeProvider>
    </QueryProvider>
  );
};

export default App;

// Styles
const TabWrapperSx: SxProps = {
  bgcolor: grey[50],
  p: 2,
  borderRadius: 1,
  height: 'calc(100vh - 96px)',
  maxHeight: '-webkit-fill-available',
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
};
