import { useEffect, useRef } from 'react';

import { queryClient } from '../components/providers/QueryProvider';
import type { ApiClient } from '../types/shell';

import { useShellService } from './useShellService';

/**
 * Hook that monitors authentication state and clears cache on logout
 * This ensures user A's cached data isn't shown to user B on shared devices
 */
export const useLogoutListener = () => {
  const apiClient = useShellService<ApiClient>('apiClient');
  const previousTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!apiClient) return;

    const checkAuthState = () => {
      const currentToken = apiClient.getAccessToken();

      // Initialize on first run
      if (previousTokenRef.current === null) {
        previousTokenRef.current = currentToken;
        return;
      }

      // Token removed (logout) or changed (different user logged in)
      if (previousTokenRef.current !== currentToken) {
        // eslint-disable-next-line no-console
        console.log('[Auth] Token changed, clearing cache');
        queryClient.clear();
        previousTokenRef.current = currentToken;
      }
    };

    // Check immediately
    checkAuthState();

    // Poll for token changes every 1 second
    const interval = setInterval(checkAuthState, 1000);

    return () => clearInterval(interval);
  }, [apiClient]);
};
