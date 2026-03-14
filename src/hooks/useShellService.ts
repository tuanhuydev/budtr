import { useEffect, useState } from 'react';

import type { ShellServiceRegistry } from '../types/shell';

/**
 * Get a service from the shell registry
 * @param serviceName - Name of the service to retrieve
 * @returns Service instance or null if not found
 */
export function getShellService<T = unknown>(serviceName: string): T | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const registry: ShellServiceRegistry | undefined = window.__SHELL_SERVICES__;

  if (!registry) {
    // eslint-disable-next-line no-console
    console.warn('[Shell] Registry not found. Ensure shell app loaded first.');
    return null;
  }

  return registry.get<T>(serviceName);
}

export function useShellService<T = unknown>(serviceName: string): T | null {
  const [service, setService] = useState<T | null>(null);

  useEffect(() => {
    const serviceInstance = getShellService<T>(serviceName);
    setService(serviceInstance);
  }, [serviceName]);

  return service;
}
