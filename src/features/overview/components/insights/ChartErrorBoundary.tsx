import { Box, SxProps, Typography } from '@mui/material';
import { Component, ErrorInfo, ReactNode } from 'react';

import { useBudtrTranslation } from '@/hooks/useI18n';

interface Props {
  children: ReactNode;
}

interface InnerProps extends Props {
  errorMessage: string;
}

interface State {
  hasError: boolean;
}

class ChartErrorBoundaryClass extends Component<InnerProps, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ChartErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={ErrorContainerSx}>
          <Typography variant='body2' color='text.secondary'>
            {this.props.errorMessage}
          </Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

export const ChartErrorBoundary = ({ children }: Props) => {
  const { t } = useBudtrTranslation();
  return (
    <ChartErrorBoundaryClass errorMessage={t('insights.chartLoadError')}>
      {children}
    </ChartErrorBoundaryClass>
  );
};

const ErrorContainerSx: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 160,
};
