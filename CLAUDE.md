# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server on port 2000
pnpm build        # Production build to dist/
pnpm preview      # Preview production build
pnpm type-check   # TypeScript check (no emit)
pnpm lint         # ESLint
pnpm lint:fix     # ESLint with auto-fix
pnpm format       # Prettier write
pnpm format:check # Prettier check
```

No test suite is configured yet.

## Environment

`APP_AUTH_URL` — backend base URL (default: `http://localhost:8888`). Set in `.env` or shell environment.

## Architecture

**Budtr is a Module Federation micro-frontend.** It exposes `./App` via `remoteEntry.js` and is designed to be mounted by a shell application. It can also run standalone via `src/bootstrap.tsx`.

### Shell service injection

The shell injects services at runtime via `window.__SHELL_SERVICES__` (a `ShellServiceRegistry`). Budtr consumes two services:

- **`apiClient`** (`ApiClient`) — authenticated HTTP client. All API calls go through `apiClient.request(url, options)`. Queries are disabled until `apiClient` is available (`enabled: !!apiClient`).
- **`i18n`** — a shared `i18next` instance. Budtr registers its own `budtr` namespace into it on mount via `useI18n`.

Use `useShellService<T>(serviceName)` to access any shell service. Never call `fetch` directly — always use `apiClient.request`.

### Data layer

All server state is managed with **TanStack Query v5**. API functions live in `src/services/api.ts` and are grouped by domain (`transactionsApi`, `assetsApi`, `statsApi`, `budgetsApi`). React Query hooks wrapping these live in `src/hooks/api/`.

DataGrid pagination is **0-based** on the frontend but the API expects **1-based** pages — the offset is applied in `transactionsApi.fetchTransactions`.

### Auth / cache lifecycle

`QueryProvider` (`src/components/providers/QueryProvider.tsx`) clears the entire query cache when the auth token changes between mounts, preventing data leakage between users on shared devices. `useLogoutListener` polls for token changes every second during a session.

### Translations (i18n)

Translations are **not** loaded from external files — they are hardcoded in `src/hooks/useI18n.ts` (English + Vietnamese). To add a new string, add it to both locale objects there. Always use `useBudtrTranslation()` (not `useTranslation` from react-i18next directly), which scopes lookups to the `budtr:` namespace.

### UI conventions

- **MUI v7** with Emotion for all UI. Theme customization in `src/configs/theme.ts`.
- `SxProps` style objects are defined as named constants at the **bottom** of each component file.
- Feature landing pages (`*Landing.tsx`) are thin orchestrators; sub-components live in a `components/` subfolder within the feature directory.
- Forms use **react-hook-form + zod** for schema validation.

### Shared singletons (Module Federation)

`react`, `react-dom`, and `react/jsx-runtime` are marked `singleton: true, eager: true` in the Module Federation config. Do not add other packages to shared without coordinating with the shell.
