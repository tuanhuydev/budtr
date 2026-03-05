import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';

import { getShellService } from '@/hooks/useShellService';
import type { ApiClient } from '@/types/shell';

// Export queryClient for cache clearing on logout
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Track last known token at module level (survives remounts)
let lastKnownToken: string | null | undefined = undefined;

export const QueryProvider: FC<PropsWithChildren> = ({ children }) => {
  const mountRef = useRef(false);

  useEffect(() => {
    const apiClient = getShellService<ApiClient>('apiClient');
    const currentToken = apiClient?.getAccessToken() ?? null;

    if (lastKnownToken === undefined) {
      // First mount ever — just record the token
      lastKnownToken = currentToken;
    } else if (lastKnownToken !== currentToken) {
      // Token changed since last mount — user switched or logged out/in
      queryClient.clear();
      lastKnownToken = currentToken;
    }

    // Also clear on unmount (shell is tearing down the micro-frontend)
    return () => {
      if (mountRef.current) {
        queryClient.clear();
        lastKnownToken = undefined;
      }
    };
  }, []);

  useEffect(() => {
    mountRef.current = true;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
