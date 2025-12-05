# Repository Guidelines

## Project Structure & Modules
- `app/`: Expo Router pages (nested route groups like `(dashboard)`, `(map)`, `(profile)`)
- `components/`: shared UI pieces; prefer reusable Tamagui/React components.
- `context/`, `hooks/`, `utils/`: state containers, custom hooks, and helpers.
- `assets/`, `locales/`, `i18n/`: static media, translations, and i18next setup.
- `scripts/`: maintenance utilities (e.g., `reset-project.js`).
- Platform folders `android/`, `ios/`; config in `app.config.js`, `tamagui.config.ts`, `metro.config.js`.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run start` / `npm run start:dev|test|prod`: start the Expo dev server with optional `APP_MODE` env.
- `npm run android|ios|web` (also `:dev|test|prod`): build & run on target platform/simulator.
- `npm run web:build` (env variants): export production-ready web build.
- `npm run lint`: run ESLint via Expo config.

## Coding Style & Naming
- TypeScript, strict mode enabled; avoid `any` and keep helpers typed.
- Follow Expo ESLint rules; fix warnings before commit (`npm run lint`).
- Prefer function components with hooks; keep UI in `components/`, screen logic in route files.
- Naming: PascalCase for components/types, camelCase for functions/vars, SCREAMING_SNAKE_CASE for env-style constants.
- Keep imports path-mapped with `@/...` (see `tsconfig.json`).

## Testing Guidelines
- No automated tests are set up yet; favor adding Jest + React Native Testing Library when touching critical flows.
- Co-locate tests alongside features using `*.test.ts(x)` naming.
- For now, exercise new screens via `npm run start:dev` and share repro steps or screen recordings in PRs.

## Commit & Pull Request Guidelines
- Use concise, action-oriented commits (e.g., `Add map zoom controls`, `Fix profile locale switch`).
- Keep PRs scoped; include summary, screenshots for UI changes, and mention affected routes/devices.
- Link related issues/tasks; note any env vars or scripts to run.
- Ensure lint is clean and builds run on the target platform(s) touched.

## Localization & Configuration
- Update strings in `locales/` and keep keys consistent across languages; wire new namespaces in `i18n/`.
- Store secrets outside the repo; rely on Expo config or device/emulator env instead of committing keys.
