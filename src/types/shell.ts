/**
 * Shell Service Registry Interface
 */
export interface ShellServiceRegistry {
  get<T = unknown>(name: string): T | null;
}

/**
 * Toast Service Interface
 */
export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface ToastService {
  notify: (message: string, severity?: ToastSeverity) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

/**
 * ApiClient Service Interface
 */
export interface RequestOptions extends RequestInit {
  auth?: boolean; // default true — attach Authorization header
}

export interface ApiClient {
  logout(): void;
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  isTokenExpired(token: string): boolean;
  request(input: RequestInfo | URL, init?: RequestOptions): Promise<Response>;
}

/**
 * Global window type extension
 */
declare global {
  interface Window {
    __SHELL_SERVICES__?: ShellServiceRegistry;
  }
}

/**
 * Shell storage service (see mfex-shell src/services/storageService.ts).
 * Untrusted, user-editable prefs only — never use for auth/permission logic.
 */
export type FieldSchema =
  | { type: 'bool' }
  | { type: 'int'; min?: number; max?: number }
  | { type: 'enum'; values: readonly string[] }
  | { type: 'id'; maxLen?: number };

export interface AppStorage<T> {
  get(): T;
  get<K extends keyof T>(key: K): T[K];
  set<K extends keyof T>(key: K, value: T[K]): void;
  update(patch: Partial<T>): void;
  remove(key: keyof T): void;
  clear(): void;
  subscribe(cb: (state: T) => void): () => void;
}

export interface ShellStorageService {
  forApp<T extends object>(
    appId: 'budtr',
    grant: string,
    opts: {
      schema: { [K in keyof T]: FieldSchema };
      defaults: T;
      version?: number;
    }
  ): AppStorage<T>;
}
