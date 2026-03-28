# TODO

 ## Current Focus
 
 - [x] Initialize repository documentation baseline.
 - [x] Bootstrap Vite + React + TypeScript project.
 - [x] Implement app foundations and MVP checklist flows.
 - [x] Finalize test coverage, CI, and deployment verification.
 - [x] Add route-level lazy loading after the production build emitted a chunk size warning.
- [x] Verify the first live GitHub Pages deployment after switching the repository Pages source to GitHub Actions.
- [x] Issue #1: shift the UI from a generic checklist app toward a practical forgotten-item checker.
- [x] Issue #2: finish the UI/UX and persistence hardening pass.
- [x] Issue #3: show the elapsed time since the last reset beneath the reset action.
- [x] Issue #4: add a first-launch consent gate before users enter the normal app flow.

## Pending

- [ ] No pending implementation tasks.

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
- [x] Switched GitHub Pages from legacy branch publishing to workflow publishing and verified the live site serves built assets from `/check-before-go-GPT/assets/`.
- [x] Stabilized `src/App.test.tsx` by splitting the slow CRUD integration test into smaller responsibilities after it hit the 5-second Vitest timeout.
- [x] Added JSON backup / restore for the local-only checklist state from the Settings screen, including validation, confirmation, and tests.
- [x] Reworked the checklist and settings UI for GitHub Issue #1 so the app feels closer to a practical forgotten-item checker than a generic task manager.
- [x] Issue #2: aligned shared page surfaces, stabilized back navigation with explicit fallbacks, added delete confirmation, and hardened persistence validation/save behavior.
- [x] Issue #3: persisted `lastResetAt` and added the localized elapsed-time hint below the reset action.
- [x] Issue #4: added a blocking first-launch consent flow, persisted versioned consent metadata, kept legal pages reachable before consent, and covered the route/storage behavior with tests.

 ## Work Log
 
- Initialized an empty repository into a Vite + React + TypeScript application.
- Selected `HashRouter` to keep GitHub Pages routing simple and robust.
- Chose `localStorage` persistence with a versioned single-state payload.
- Adjusted Vite to the 7.x line because the current `vite-plugin-pwa` peer range does not support Vite 8 yet.
- Implemented the MVP with `en` / `es` / `ja`, theme persistence, reorder safety, and local-only data storage.
- Generated PWA icons and build artifacts, and prepared GitHub Actions workflows for CI and Pages deployment.
- Replaced eager route imports with route-level lazy loading after the production build warned about a 556.55 kB main chunk; the largest post-change entry chunk is now 398.60 kB and the warning is gone.
- Diagnosed the first remote Pages failure: `actions/configure-pages@v5` failed because Pages had stayed on `main` / `/` (`build_type: legacy`) instead of GitHub Actions.
- Switched the repository Pages build type to `workflow`, pushed the latest commits, and verified a successful `Deploy to GitHub Pages` run plus live HTML that references `/check-before-go-GPT/assets/...`.
- Selected backup / restore as the next likely feature candidate, then fixed a newly surfaced Vitest timeout in `src/App.test.tsx` by splitting the slow CRUD flow into smaller tests before moving on.
- Added export / import controls to the settings screen, validated backup files through `src/lib/storage.ts`, and covered restore success, cancel, and invalid-file behavior with automated tests.
 - Opened GitHub Issue #1 with the reference image and re-scoped the next iteration from a narrow checklist tweak to a broader UI/UX pass covering both the checklist and settings screens.
 - Reworked the checklist rows into confirmation slots, moved edit/delete behind a quieter overflow menu, simplified the settings page structure, and added accessibility plus backup-export regression coverage before the final deploy verification.
- Reviewed open GitHub Issues and selected the session scope as `#2 -> #3`, because `TODO.md` had already been cleared while the repository still had two open implementation issues.
- Re-ran the baseline `npm run lint`, `npm run test`, and `npm run build` before editing; all three passed on the pre-change codebase.
- Added a shared `PageSection` surface, refreshed the reorder/legal/settings-adjacent screens, fixed `ReorderPage` status labels, and replaced fragile back navigation with explicit fallback routes.
- Added delete confirmation, unified persisted-state version parsing between boot and backup restore, and wrapped `localStorage.setItem` so quota/storage failures do not crash the app.
- Extended the persisted state with `lastResetAt`, recorded it on reset, rendered a localized relative-time hint below the reset button, and kept older saved data / backups backward compatible by normalizing missing metadata to `null`.
- Re-ran `npm run lint`, `npm run test`, and `npm run build` after the final changes; all three passed.
- Replaced the SVG-first favicon setup with the bundled `favicon_io.zip` assets, switched the PWA manifest icons to the provided Android Chrome PNGs, and prepared a regression test around the favicon references.
- Reviewed the single remaining open GitHub issue (#4), confirmed the app uses `localStorage` rather than cookies, and treated the issue as the current session scope because `TODO.md` had no pending implementation work.
- Added a dedicated `/consent` route plus guarded app routes so checklist/settings/reorder stay blocked until the current legal/storage notice version is accepted, while `/terms` and `/privacy` remain readable beforehand.
- Extended the persisted app state and backup format with versioned consent metadata, defaulted older payloads to `consent: null`, and preserved the acceptance record across export/restore.
- Added multilingual consent copy (`ja` / `en` / `es`), adjusted legal-page back navigation for pre-consent viewing, and re-ran `npm run lint`, `npm run test`, and `npm run build` successfully after the change.
