# Change Log

## 2026-03-28

- Added a first-launch consent gate tied to Terms of Use, Privacy Policy, and the app's local storage behavior.
- Kept `/terms` and `/privacy` readable before consent while blocking the normal checklist/settings/reorder routes until the current consent version is accepted.
- Extended persisted state and backup data with versioned consent metadata, plus regression coverage for first launch, legal access, guarded deep links, and consent persistence.

## 2026-03-27

- Established the first implementation baseline for the CheckBefore MVP.
- Recorded the routing, persistence, theming, and deployment approach before feature work.
- Chose Vite 7.x instead of the scaffolded Vite 8.x to maintain compatibility with `vite-plugin-pwa`.
- Added local JSON backup / restore so users can export and recover their checklist state without a backend.
- Adjusted the checklist and settings UI so the product reads more like a focused forgotten-item checker, including quieter management actions and stronger accessibility/test coverage around confirmation state and backup export.
