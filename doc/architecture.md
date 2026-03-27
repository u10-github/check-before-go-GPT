# Architecture

## Directory structure

- `src/App.tsx` - app composition and route tree
- `src/context/AppStateContext.tsx` - checklist and settings state management
- `src/lib/storage.ts` - versioned local storage helpers
- `src/messages.ts` - message dictionaries and locale helpers
- `src/theme/theme.ts` - MUI theme generation
- `src/pages/` - route-level pages
- `src/components/` - reusable UI components
- `src/hooks/useInstallPrompt.ts` - PWA install prompt hook

## Routing strategy

- Use `HashRouter` to stay compatible with GitHub Pages static hosting.
- Supported routes:
  - `/` - checklist
  - `/settings` - settings
  - `/reorder` - reorder flow
  - `/terms` - terms of use
  - `/privacy` - privacy policy

## State management

- `AppStateContext` owns checklist items and user settings.
- Mutations are exposed as typed callbacks for add, edit, delete, toggle, reset, reorder, language change, and theme change.
- Route pages consume the context through `useAppState()`.

## Persistence strategy

- Persist a single object under one local storage key.
- Normalize invalid or missing data back to safe defaults.
- Reindex item order whenever deletion or reordering changes the list.

## i18n strategy

- `react-intl` provides runtime translation.
- Message dictionaries live in one file for the MVP.
- Browser locale detection is used only when there is no saved user preference.

## Theme strategy

- MUI `ThemeProvider` wraps the application.
- The saved theme setting resolves to either `light`, `dark`, or system preference.
- `CssBaseline` provides consistent defaults.

## PWA strategy

- `vite-plugin-pwa` handles manifest and service worker generation.
- The app shell and static assets are precached.
- The settings screen exposes install capability through `beforeinstallprompt` when the browser supports it.
