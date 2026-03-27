# Decision Log

## 2026-03-27

### Use HashRouter for production routing

- **Decision:** Use `HashRouter` instead of history-fallback routing.
- **Reason:** GitHub Pages is a hard requirement and hash-based routing avoids extra redirect or `404.html` rewriting logic.

### Use a single versioned `localStorage` payload

- **Decision:** Persist checklist items and UI settings in one versioned `localStorage` record.
- **Reason:** The app has no backend and only one checklist, so a single payload keeps migrations and debugging simple.

### Keep state management inside React context + hooks

- **Decision:** Avoid extra state libraries for the MVP.
- **Reason:** The domain is small, local-first, and easier to maintain with React primitives.

### Use MUI components directly

- **Decision:** Build the UI from standard MUI components instead of a custom design system.
- **Reason:** This reduces visual inconsistency and is easier for AI-assisted maintenance.

### Pin Vite to the 7.x line for now

- **Decision:** Stay on Vite 7 during the MVP.
- **Reason:** `vite-plugin-pwa` currently declares peer support through Vite 7, so this combination is safer than forcing an unsupported Vite 8 setup.
