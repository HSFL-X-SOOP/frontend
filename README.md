# Marlin

A cross-platform React Native application built with [Expo](https://expo.dev) for sensor monitoring and visualization. Runs on iOS, Android, and Web.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- For iOS: Xcode (macOS only)
- For Android: Android Studio with an emulator or a physical device

## Environment Setup

A `.env` file is required at the project root. Use `.env.example` as a reference for the values that need to be set:

```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Copy the example and fill in the values:

```bash
cp .env.example .env
```

## Platform-Specific Configuration Files

These files are gitignored and must be obtained separately:

- **Android**: `android/app/google-services.json` — Firebase configuration file required for push notifications and Google Sign-In.
- **iOS**: `ios/GoogleService-Info.plist` — Firebase configuration file required for push notifications and Google Sign-In.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the app:

   ```bash
   npm start
   ```

## Run Profiles

Each platform (web, iOS, Android) has three run profiles controlled by the `APP_MODE` environment variable. The default mode is `test`.

| Profile | Command Examples | Backend URL | Description |
|---------|-----------------|-------------|-------------|
| **dev** | `npm run start:dev`, `npm run ios:dev`, `npm run android:dev`, `npm run web:dev` | `http://localhost:8080` | Local development. Requires the Marlin backend running locally. |
| **test** | `npm run start:test`, `npm run ios:test`, `npm run android:test`, `npm run web:test` | `https://test.marlin-live.com/api` | Marlin test/staging server. |
| **prod** | `npm run start:prod`, `npm run ios:prod`, `npm run android:prod`, `npm run web:prod` | `https://marlin-live.com/api` | Marlin production server. |

### Web Build Profiles

Web builds also support all three profiles:

```bash
npm run web:build:dev
npm run web:build:test
npm run web:build:prod
```

### Running on a Specific Platform

```bash
# Android
npm run android:test

# iOS
npm run ios:test

# Web
npm run web:test
```

## Linting

```bash
npm run lint
```
