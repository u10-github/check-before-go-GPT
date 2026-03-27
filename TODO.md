# TODO

## Current Focus

- [x] Initialize repository documentation baseline.
- [x] Bootstrap Vite + React + TypeScript project.
- [x] Implement app foundations and MVP checklist flows.
- [x] Finalize test coverage, CI, and deployment verification.
- [x] Add route-level lazy loading after the production build emitted a chunk size warning.

## Pending

- [ ] Verify the first live GitHub Pages deployment on the remote repository after switching Pages source to GitHub Actions.

## In Progress

- [ ] No active implementation tasks.

## Completed

- [x] Created `doc/requirement.md`.
- [x] Created `doc/decision-log.md`.
- [x] Created `doc/architecture.md`.
- [x] Created `doc/change-log.md`.
- [x] Created initial session implementation plan.
- [x] Bootstrapped project with Vite and installed core dependencies.
- [x] Implemented the single-list checklist UI and local persistence.
- [x] Added settings, reorder flow, legal pages, and PWA install support.
- [x] Added GitHub Actions CI / Pages deployment workflows.
- [x] Verified `npm run lint`, `npm run test`, and `npm run build`.
- [x] Split route pages with `React.lazy` / `Suspense` to remove the Vite chunk size warning from the main bundle.

## Work Log

- Initialized an empty repository into a Vite + React + TypeScript application.
- Selected `HashRouter` to keep GitHub Pages routing simple and robust.
- Chose `localStorage` persistence with a versioned single-state payload.
- Adjusted Vite to the 7.x line because the current `vite-plugin-pwa` peer range does not support Vite 8 yet.
- Implemented the MVP with `en` / `es` / `ja`, theme persistence, reorder safety, and local-only data storage.
- Generated PWA icons and build artifacts, and prepared GitHub Actions workflows for CI and Pages deployment.
- Replaced eager route imports with route-level lazy loading after the production build warned about a 556.55 kB main chunk; the largest post-change entry chunk is now 398.60 kB and the warning is gone.
- Diagnosed the first remote Pages failure: `actions/configure-pages@v5` failed because Pages was not enabled yet, and the repository is currently publishing from `main` / `/` (`build_type: legacy`) instead of GitHub Actions.
- Left the repository Pages source unchanged for this session by request, so live deployment verification remains pending until the remote setting is switched to GitHub Actions.
