# Requirement

## Product summary

Build a mobile-first web app called **CheckBefore**. The app acts as a single-list forgetting checker that users open on a smartphone and review from top to bottom before going out.

## Functional requirements

### Checklist

- The application manages exactly one checklist.
- Each item has `id`, `text`, `checked`, `order`, `createdAt`, and `updatedAt`.
- Users can add, edit, delete, and toggle items.
- New items are appended to the end of the list.
- Default display order is registration order.
- No automatic sorting such as "unchecked first" is allowed.

### Reordering

- Reordering must be separated from the normal checking flow.
- The entry point to reordering must live in the settings screen.
- The UI should favor safety over speed to reduce accidental operations.

### Reset

- Users can reset all items to unchecked.
- Reset must require a confirmation dialog.
- Canceling the dialog must leave state untouched.

### Initial consent

- On first launch, the app must show a blocking consent screen before the normal checklist flow.
- Users must be able to open the Terms of Use and Privacy Policy from the consent screen before accepting.
- The consent screen must describe the actual local storage behavior of the app and must not claim cookie usage when cookies are not used for app persistence.
- Protected routes such as the checklist, settings, and reorder screens must stay inaccessible until the current consent version is accepted.
- Consent persistence should keep enough version metadata to support future re-consent when legal/storage notices change.

### Settings

- Settings screen must support language selection.
- Settings screen must support theme selection: `system`, `light`, `dark`.
- Settings screen must include a PWA install entry when available.
- Settings screen must allow exporting the current checklist and settings as a JSON backup.
- Settings screen must allow restoring a previously exported JSON backup after explicit confirmation.
- Invalid backup files must be rejected without mutating the current state.

### Pages

- Main checklist page
- Settings page
- Reorder page or reorder-only mode
- Terms of Use page
- Privacy Policy page

## Internationalization requirements

- Initial supported languages are English (`en`), Español (`es`), and 日本語 (`ja`).
- The default language is inferred from browser settings.
- If a user explicitly selects a language, that choice overrides browser detection.
- Unsupported languages must fall back to English.
- The implementation must make future additions like `fr`, `pt`, and `ar` straightforward.
- Only UI strings are translated; user-entered checklist text is never translated.

## Theme requirements

- The app supports `system`, `light`, and `dark` theme modes.
- User selection is persisted.
- MUI theming should provide the implementation foundation.

## PWA requirements

- The app should be installable.
- Manifest, icons, and service worker must be configured.
- The app must at least launch offline with previously cached assets and stored local state.
- The settings page should expose the install path to users.

## Hosting and operations requirements

- The app must work on static hosting such as GitHub Pages.
- No backend or server-side persistence is allowed.
- GitHub Actions must be able to build and deploy the app.
- Routing must remain compatible with static hosting constraints.

## Non-functional requirements

- TypeScript strictness should remain enabled.
- The codebase should use established libraries and avoid unnecessary custom infrastructure.
- Documentation must be kept close to the implementation.
- README must explain setup, development, test, and deployment.
- Lint, test, and build must all succeed.

## Acceptance criteria

- A user can manage a single checklist end-to-end in the browser.
- The checked state survives reloads.
- Language and theme settings survive reloads.
- A user can export and restore the full local state without a backend.
- A first-launch user must accept the current terms/privacy/storage notice before entering the normal app flow.
- Reordering is available only through the settings flow.
- Reset requires confirmation.
- Terms and privacy pages are reachable.
- The app builds for GitHub Pages and includes PWA metadata.
- Tests cover the main user flows and persistence behavior.
