# Configuration Management

Centralized configuration system for MARLIN frontend. All application-wide constants, settings, and configuration are managed through this directory.

## Overview

Configuration is organized by concern and can be imported from the root `config` module:

```typescript
import {
  MAP_CONSTANTS,
  UI_CONSTANTS,
  STORAGE_KEYS,
  MEASUREMENT_CONFIG,
  ENV,
} from '@/config';
```

## Configuration Files

### 1. `constants.ts`
General application constants organized by feature area:

**STORAGE_KEYS**
- Session, theme, language, map state, onboarding
- Used with AsyncStorage/localStorage

**MAP_CONSTANTS**
- Home coordinates (default map center)
- Zoom levels (min, max, default, sensor detail)
- Map boundaries (Europe focus)
- Animation durations
- Clustering configuration

**UI_CONSTANTS**
- Toast notification durations
- Debounce delays
- Animation speeds
- Pagination settings

**API_CONSTANTS**
- Request timeouts
- Retry configuration
- Token refresh settings

**VALIDATION_CONSTANTS**
- Email, password, name regex patterns
- Min/max field lengths

### 2. `environment.ts`
Environment-specific configuration:

```typescript
export const ENV = {
  apiUrl: 'https://test.marlin-live.com/api',
  appMode: 'test', // 'dev' | 'test' | 'prod'
  isDev: false,
  isProd: false,
  logLevel: 'info',
};
```

Automatically configured based on `APP_MODE` environment variable:
- `dev`: http://localhost:8080
- `test`: https://test.marlin-live.com/api (default)
- `prod`: https://marlin-live.com/api

### 3. `measurements.ts`
Measurement type configuration:

```typescript
MEASUREMENT_CONFIG[MeasurementType.WaterTemperature] = {
  displayName: 'Water Temperature',
  translationKey: 'measurements.waterTemperature',
  unit: '°C',
  color: '#F97316',
  bgColor: '$orange5',
  icon: 'Thermometer',
  precision: 1,
};
```

Benefits:
- Single source of truth for measurement types
- Easy to update colors, units, icons
- Type-safe access to measurement properties

### 4. `navigationConfig.ts`
Navigation structure and items:

```typescript
MAIN_NAVIGATION_ITEMS = [map, dashboard]
SECONDARY_NAVIGATION_ITEMS = [api, sensors, project website]
AUTH_NAVIGATION_ITEMS = {profile, logout, login, register}
NAVIGATION_STYLES = {icon sizes, spacing, buttons}
```

Shared across web and native navigation components.

### 5. `index.ts`
Central export point - combines all configuration modules.

## Usage Patterns

### Accessing Constants

```typescript
import { MAP_CONSTANTS, UI_CONSTANTS, STORAGE_KEYS } from '@/config';

// Use directly
const maxZoom = MAP_CONSTANTS.ZOOM_LEVELS.MAX;
const toastDuration = UI_CONSTANTS.TOAST_DURATION.MEDIUM;
const sessionKey = STORAGE_KEYS.SESSION;
```

### Environment-Aware Configuration

```typescript
import { ENV } from '@/config';

if (ENV.isDev) {
  // Development-only code
}

const apiUrl = ENV.apiUrl; // Automatically set based on APP_MODE
```

### Measurement Type Configuration

```typescript
import { MEASUREMENT_CONFIG, MeasurementType } from '@/config';

const waterTempConfig = MEASUREMENT_CONFIG[MeasurementType.WaterTemperature];
console.log(waterTempConfig.color); // '#F97316'
console.log(waterTempConfig.unit); // '°C'
```

### Navigation Items

```typescript
import { MAIN_NAVIGATION_ITEMS, isExternalLink } from '@/config';

MAIN_NAVIGATION_ITEMS.forEach(item => {
  console.log(item.label, item.href);
});

const isExternal = isExternalLink('https://example.com');
```

## Adding New Configuration

### Step 1: Identify the Category
- General app behavior? → `constants.ts`
- Environment-specific? → `environment.ts`
- Measurement-related? → `measurements.ts`
- Navigation-related? → `navigationConfig.ts`

### Step 2: Add to Appropriate File

```typescript
// In constants.ts
export const MY_NEW_CONSTANTS = {
  VALUE1: 'value1',
  VALUE2: 100,
} as const;
```

### Step 3: Export from index.ts (if needed)

```typescript
// Usually automatic if using export * from './constants'
```

## Benefits

✅ **Centralized**: All constants in one organized location
✅ **Type-Safe**: Full TypeScript support with type inference
✅ **Environment-Aware**: Easy to switch between dev/test/prod
✅ **Maintainable**: Changes don't require searching codebase
✅ **Documented**: Self-documenting with clear structure
✅ **Performance**: const objects at module load time
✅ **Reusable**: Shared across all components and services

## Common Tasks

### Update Toast Duration

```typescript
// Before: Change every occurrence in codebase
showToast(message, 5000); // Where is this defined?

// After: Update once
UI_CONSTANTS.TOAST_DURATION.LONG = 6000;
showToast(message, UI_CONSTANTS.TOAST_DURATION.LONG);
```

### Add New Measurement Type

```typescript
// In measurements.ts
[MeasurementType.NewType]: {
  displayName: 'New Type',
  translationKey: 'measurements.newType',
  unit: '%',
  color: '#00FF00',
  bgColor: '$green5',
  icon: 'Gauge',
  precision: 2,
},
```

### Change API Endpoint

```typescript
// Automatically handled by environment.ts based on APP_MODE
// Just run: APP_MODE=prod npm run web:build
```

## Organization Principles

1. **Group by concern**: Related constants grouped together
2. **Use as const**: Preserves literal types for type safety
3. **Descriptive names**: Constants clearly named for their purpose
4. **Comments**: Complex values include comments explaining usage
5. **Immutable**: All constants are `as const` to prevent mutations

## Best Practices

✅ **DO:**
- Import constants from `@/config`
- Use constant names instead of magic numbers
- Update configuration in one place only
- Document new constants

❌ **DON'T:**
- Hardcode values in components
- Duplicate configuration values
- Store environment variables in config files
- Import directly from individual files (use index.ts)

## Environment-Specific Configuration

### Development (`APP_MODE=dev`)
```
API URL: http://localhost:8080
Log Level: debug
Timeouts: Increased (for debugging)
```

### Test (`APP_MODE=test`) - DEFAULT
```
API URL: https://test.marlin-live.com/api
Log Level: info
Timeouts: Standard
```

### Production (`APP_MODE=prod`)
```
API URL: https://marlin-live.com/api
Log Level: warn
Timeouts: Standard
Caching: Enabled
```

## Debugging Configuration

To see current configuration:

```typescript
import { ENV, MAP_CONSTANTS, UI_CONSTANTS } from '@/config';

console.log('Environment:', ENV);
console.log('Map Config:', MAP_CONSTANTS);
console.log('UI Config:', UI_CONSTANTS);
```

## Type Safety

All configuration uses TypeScript `as const` for strict typing:

```typescript
// ✅ Type-safe
const key: 'session' = STORAGE_KEYS.SESSION;

// ❌ Type error - prevents mistakes
const key: 'invalid' = STORAGE_KEYS.SESSION;
```
