# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MARLIN** (Maritime Live Information) is a cross-platform mobile application built with React Native and Expo for visualizing real-time maritime sensor data. The app displays water and air temperature measurements from various locations (marinas) on an interactive map with clustering support.

## Environment Setup

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start                    # Interactive mode
npm run start:dev           # Development API
npm run start:test          # Test API (default)
npm run start:prod          # Production API

# Run on specific platforms
npm run ios                 # Default environment
npm run ios:dev             # Development API
npm run ios:test            # Test API
npm run ios:prod            # Production API

npm run android             # Default environment
npm run android:dev         # Development API
npm run android:test        # Test API
npm run android:prod        # Production API

npm run web                 # Default environment
npm run web:dev             # Development API
npm run web:test            # Test API
npm run web:prod            # Production API

# Build for web
npm run web:build           # Default environment
npm run web:build:dev       # Development API
npm run web:build:test      # Test API
npm run web:build:prod      # Production API

# Linting
npm run lint
```

### Environment Configuration

The app uses three environment modes controlled via the `APP_MODE` environment variable (set automatically by npm scripts):

- **dev**: `http://localhost:8080`
- **test**: `https://test.marlin-live.com/api` (default)
- **prod**: `https://marlin-live.com/api`

Environment configuration is managed in `config/environment.ts` and `app.config.js`.

## Architecture

### Core Technologies

- **Framework**: React Native 0.79.5 with Expo SDK ~53
- **Routing**: Expo Router (file-based routing) with typed routes
- **UI Library**: Tamagui for cross-platform UI components
- **Styling**: Tamagui + global.css
- **State Management**: Context API (SessionContext, ThemeSwitch) + custom stores in `api/stores/`
- **Internationalization**: i18next with react-i18next (German and English)
- **Maps**: MapLibre for native, MapLibre GL JS for web
- **HTTP Client**: Axios with automatic token refresh interceptors
- **Authentication**: JWT with access/refresh tokens, Google OAuth support, Firebase Cloud Messaging

### Project Structure

```
frontend/
├── app/                          # File-based routing (Expo Router)
│   ├── (auth)/                   # Auth group: login, register, oauth-callback, magic-link
│   ├── (map)/                    # Map screen
│   ├── (dashboard)/              # Marina detail views
│   ├── (profile)/                # User profile and settings
│   ├── (about)/                  # About, API, sensors info
│   ├── (other)/                  # Prices, privacy, terms
│   ├── _layout.tsx               # Root layout with providers
│   └── index.tsx                 # Entry point
├── components/                   # Reusable UI components
│   ├── auth/                     # Authentication components
│   ├── common/                   # Shared components (LanguageSelector)
│   ├── dashboard/                # Marina dashboard components
│   ├── map/                      # Map-related components
│   │   ├── controls/             # Map controls (zoom, filter, drawer)
│   │   ├── drawers/              # Platform-specific drawers
│   │   ├── markers/              # Sensor and cluster markers
│   │   │   ├── native/           # Native marker implementations
│   │   │   └── web/              # Web marker implementations
│   │   └── sensors/              # Sensor list and detail components
│   ├── navigation/               # Navigation components
│   │   ├── native/               # Native tab bar
│   │   └── web/                  # Web navbar and footer
│   ├── speeddial/                # Floating action button component
│   └── ui/                       # Base UI components
├── api/                          # API layer
│   ├── client.ts                 # HTTP client with auth interceptors
│   ├── models/                   # TypeScript interfaces for API data
│   └── stores/                   # Data fetching logic (auth, sensors, locations, user)
├── hooks/                        # Custom React hooks
│   ├── core/                     # Core utilities (asyncHandler)
│   ├── useAuth.ts                # Authentication hook
│   ├── useSensors.ts             # Sensor data fetching hooks
│   ├── useSupercluster.ts        # Map clustering logic
│   ├── useTranslation.ts         # i18n wrapper hook
│   └── ...                       # Other hooks
├── context/                      # React Context providers
│   ├── SessionContext.tsx        # Authentication session management
│   └── ThemeSwitch.tsx           # Theme (light/dark mode) management
├── i18n/                         # Internationalization setup
│   └── index.ts                  # i18next initialization
├── locales/                      # Translation files
│   ├── en/                       # English translations
│   └── de/                       # German translations (default)
├── utils/                        # Utility functions
├── types/                        # TypeScript type definitions
├── config/                       # Configuration files
│   └── environment.ts            # Environment-specific config
├── assets/                       # Static assets
│   ├── mapStyles/                # MapLibre style JSON files
│   └── markers/                  # Marker assets
└── ios/ & android/               # Native platform code
```

### Key Architectural Patterns

#### Platform-Specific Components

The codebase uses React Native's platform-specific file extensions extensively:

- `.native.tsx` - React Native components (iOS/Android)
- `.web.tsx` - Web-specific components
- Base `.tsx` - Shared or platform-agnostic code

Examples:
- `components/Map.native.tsx` vs `components/Map.web.tsx`
- `components/map/drawers/MapSensorDrawer.native.tsx` vs `MapSensorDrawer.web.tsx`
- `components/dashboard/chart/LineChartCard.native.tsx` vs `LineChartCard.web.tsx`

When working with existing components, check for platform-specific variants before making changes.

#### Authentication Flow

1. User authenticates via login/register or Google OAuth
2. `SessionContext` stores session info (access token, refresh token, profile) in AsyncStorage
3. `api/client.ts` HTTP client automatically:
   - Attaches Bearer token to requests
   - Refreshes expired tokens (15min lifetime with 1min tolerance)
   - Handles 401 responses with automatic retry after token refresh
   - Logs out user if refresh fails
4. Session persists across app restarts via AsyncStorage

#### API Client Pattern

All API calls go through `api/stores/` which use the `useHttpClient()` hook:

```typescript
// In stores
export const useSensorStore = () => {
  const httpClient = useHttpClient();

  return {
    getSensorDataNew: async () => {
      const { data } = await httpClient.get('/sensors/new');
      return data;
    }
  };
};

// In components
const sensorStore = useSensorStore();
const data = await sensorStore.getSensorDataNew();
```

#### Map Implementation

Two completely separate implementations:

**Native (MapLibre React Native):**
- Uses `@maplibre/maplibre-react-native`
- Custom marker components with `<MarkerView>`
- Manual viewport bounds tracking via `onRegionDidChange`
- Camera control via `CameraRef`

**Web (MapLibre GL JS):**
- Uses `react-map-gl` wrapper
- Web-optimized marker rendering
- Built-in viewport state management
- Different clustering approach

Both implementations share:
- Sensor data hooks (`useSensors.ts`)
- Clustering logic (`useSupercluster.ts`)
- Filter state management
- Same data models from `api/models/sensor.ts`

#### Internationalization

- Default language: German (`de`)
- Fallback language: German
- Language preference stored in AsyncStorage
- Initialized in `app/_layout.tsx` via `import '@/i18n'`
- Access translations via `useTranslation()` hook
- Namespaces: `common`, `about`, `api`, `sensors`
- Translation files in `locales/{lang}/{namespace}.json`

## Important Notes

### Path Aliases

The codebase uses `@/*` as an alias for the root directory (configured in `tsconfig.json`).

### Theme Management

The app supports light and dark modes:
- Theme context in `context/ThemeSwitch.tsx`
- Theme preference persisted to AsyncStorage
- Map styles switch based on theme: `assets/mapStyles/dark_mode_new.json` vs `light_mode_new.json`

### TypeScript Configuration

- Strict mode enabled
- Path aliases configured: `@/*` maps to root
- Skip lib check enabled for faster builds

### Navigation

The app uses Expo Router with group-based navigation:
- Native: Bottom tab bar (`components/navigation/native/tabbar.tsx`)
- Web: Top navbar + footer (`components/navigation/web/navbar.tsx`, `Footer.tsx`)
- Authenticated routes redirect to login if no session exists

### Component Library (Tamagui)

Tamagui provides styled primitives:
- Use Tamagui components (`YStack`, `XStack`, `Text`, etc.) for consistent styling
- Theme tokens available: `$color`, `$background`, `$borderColor`, etc.
- Configuration in `tamagui.config.ts`

### Firebase Integration

- Firebase Cloud Messaging configured for push notifications
- Native only (iOS/Android)
- Token retrieval in `app/_layout.tsx`
- Android requires `POST_NOTIFICATIONS` permission

### Testing Notes

- The app logs warning messages about MapLibre requests - these are intentionally ignored via `LogBox.ignoreLogs()`
