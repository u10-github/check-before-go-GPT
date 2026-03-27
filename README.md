# CheckBefore

CheckBefore is a mobile-first forgetting prevention checklist app. It is built as a static React SPA so it can be deployed to GitHub Pages with near-zero running cost.

## Features

- Single fixed checklist with add, edit, delete, toggle, and reorder flows
- Persistent state via `localStorage`
- Backup export and restore from the settings screen
- Reset-all action with confirmation dialog
- Settings page for language, theme, and install guidance
- English, Español, 日本語 UI
- Light / Dark / System theme support
- PWA-ready offline shell
- Terms of Use and Privacy Policy pages
- GitHub Actions workflows for CI and GitHub Pages deployment

## Tech stack

- React
- TypeScript
- Vite
- MUI
- React Router (`HashRouter` for static hosting compatibility)
- React Intl
- vite-plugin-pwa
- Vitest + React Testing Library
- ESLint + Prettier

## Getting started

```bash
npm install
npm run dev
```

The local app starts at `http://localhost:5173`.

## Scripts

- `npm run dev` - start development server
- `npm run lint` - run ESLint
- `npm run test` - run Vitest once
- `npm run test:watch` - run Vitest in watch mode
- `npm run build` - type-check and build production assets
- `npm run preview` - preview the production build locally
- `npm run format` - verify Prettier formatting

## Project structure

- `TODO.md` - work tracking source for implementation progress
- `doc/requirement.md` - implementation baseline and acceptance criteria
- `doc/decision-log.md` - technical choices and rationale
- `doc/change-log.md` - requirement or implementation changes over time
- `doc/architecture.md` - app structure and architectural decisions
- `src/` - application source code
- `public/` - static assets for favicon and PWA icons
- `.github/workflows/` - CI and GitHub Pages deployment workflows

## Persistence model

The app stores a single versioned state object in `localStorage`.

- `items`: checklist rows with `id`, `text`, `checked`, `order`, `createdAt`, `updatedAt`
- `settings.language`: `en`, `es`, or `ja`
- `settings.themeMode`: `system`, `light`, or `dark`

You can also export the current state as a JSON backup and later restore it from the settings screen.

## Deployment

GitHub Pages deployment is handled by `.github/workflows/deploy.yml`.

1. Push to the default branch.
2. Enable **GitHub Pages** and choose **GitHub Actions** as the source.
3. The workflow builds the Vite app and deploys `dist/` automatically.

The Vite base path is resolved from `GITHUB_REPOSITORY` during GitHub Actions builds, so the same source works locally and on Pages.

## Quality checklist

Before shipping a change, run:

```bash
npm run lint
npm run test
npm run build
```
