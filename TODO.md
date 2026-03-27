# TODO

## Current Focus

- [x] Initialize repository documentation baseline.
- [x] Bootstrap Vite + React + TypeScript project.
- [x] Implement app foundations and MVP checklist flows.
- [x] Finalize test coverage, CI, and deployment verification.

## Pending

- [ ] Consider route-level code splitting if the bundle warning becomes a problem.
- [ ] Verify the first live GitHub Pages deployment on the remote repository.

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

## Work Log

- Initialized an empty repository into a Vite + React + TypeScript application.
- Selected `HashRouter` to keep GitHub Pages routing simple and robust.
- Chose `localStorage` persistence with a versioned single-state payload.
- Adjusted Vite to the 7.x line because the current `vite-plugin-pwa` peer range does not support Vite 8 yet.
- Implemented the MVP with `en` / `es` / `ja`, theme persistence, reorder safety, and local-only data storage.
- Generated PWA icons and build artifacts, and prepared GitHub Actions workflows for CI and Pages deployment.
