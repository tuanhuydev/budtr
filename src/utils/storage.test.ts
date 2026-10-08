import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('budtr storage wrapper', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal('window', {});
  });

  it('degrades to in-memory when the shell has no storage service', async () => {
    const { getStorage } = await import('./storage');
    const s = getStorage(3);
    expect(s.get('activeTab')).toBe(0);
    s.set('activeTab', 2);
    expect(s.get('activeTab')).toBe(2);
  });

  it('uses the shell slice when a grant and service are present', async () => {
    const forApp = vi.fn().mockReturnValue({ get: () => 1 });
    vi.stubGlobal('window', {
      __SHELL_SERVICES__: { get: () => ({ forApp }) },
    });
    const { getStorage, initStorage } = await import('./storage');
    initStorage('grant-1');
    getStorage(3);
    expect(forApp).toHaveBeenCalledWith(
      'budtr',
      'grant-1',
      expect.objectContaining({
        schema: { activeTab: { type: 'int', min: 0, max: 2 } },
      })
    );
  });

  it('stays in memory without a grant even if the service exists', async () => {
    const forApp = vi.fn();
    vi.stubGlobal('window', {
      __SHELL_SERVICES__: { get: () => ({ forApp }) },
    });
    const { getStorage } = await import('./storage');
    getStorage(3).set('activeTab', 1);
    expect(forApp).not.toHaveBeenCalled();
  });
});
