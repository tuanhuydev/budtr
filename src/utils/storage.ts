import { getShellService } from '../hooks/useShellService';
import type { AppStorage, ShellStorageService } from '../types/shell';

/**
 * budtr's slice of the shell `mfex:storage` object. Low-value UI prefs only;
 * this is user-editable, so never derive auth/permission decisions from it.
 */
export interface BudtrPrefs {
  activeTab: number;
}

const DEFAULTS: BudtrPrefs = { activeTab: 0 };

let grant: string | undefined;
let handle: AppStorage<BudtrPrefs> | undefined;

/** Called once with the grant the shell passes to <App storageGrant=... />. */
export function initStorage(storageGrant: string | undefined): void {
  if (storageGrant && storageGrant !== grant) {
    grant = storageGrant;
    handle = undefined;
  }
}

/** In-memory stand-in for an older shell without the storage service. */
function memoryStorage(): AppStorage<BudtrPrefs> {
  let state = { ...DEFAULTS };
  const listeners = new Set<(s: BudtrPrefs) => void>();
  const emit = () => listeners.forEach(cb => cb({ ...state }));
  return {
    get: ((key?: keyof BudtrPrefs) =>
      key === undefined
        ? { ...state }
        : state[key]) as AppStorage<BudtrPrefs>['get'],
    set: (key, value) => {
      state = { ...state, [key]: value };
      emit();
    },
    update: patch => {
      state = { ...state, ...patch };
      emit();
    },
    remove: key => {
      state = { ...state, [key]: DEFAULTS[key] };
      emit();
    },
    clear: () => {
      state = { ...DEFAULTS };
      emit();
    },
    subscribe: cb => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
  };
}

export function getStorage(tabCount: number): AppStorage<BudtrPrefs> {
  if (handle) return handle;
  const service = getShellService<ShellStorageService>('storage');
  handle =
    service && grant
      ? service.forApp<BudtrPrefs>('budtr', grant, {
          schema: { activeTab: { type: 'int', min: 0, max: tabCount - 1 } },
          defaults: DEFAULTS,
        })
      : memoryStorage();
  return handle;
}
