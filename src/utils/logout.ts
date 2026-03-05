import { queryClient } from '../components/providers/QueryProvider';
import { getShellService } from '../hooks/useShellService';
import type { ApiClient } from '../types/shell';

/**
 * Wraps apiClient.logout() to also clear React Query cache
 * Use this function instead of calling apiClient.logout() directly
 *
 * @example
 * ```tsx
 * import { logoutAndClearCache } from '@/utils/logout';
 *
 * <Button onClick={logoutAndClearCache}>Logout</Button>
 * ```
 */
export const logoutAndClearCache = () => {
  const apiClient = getShellService<ApiClient>('apiClient');

  if (apiClient) {
    // eslint-disable-next-line no-console
    console.log('[Auth] Logging out and clearing cache');

    // Clear all cached queries
    queryClient.clear();

    // Call shell's logout
    apiClient.logout();
  } else {
    // eslint-disable-next-line no-console
    console.warn('[Auth] ApiClient not available for logout');
  }
};

/**
 * Manually clear query cache without logging out
 * Useful for debugging or forcing data refresh
 */
export const clearQueryCache = () => {
  // eslint-disable-next-line no-console
  console.log('[Cache] Manually clearing query cache');
  queryClient.clear();
};
