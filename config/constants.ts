/**
 * Application-wide constants
 * Centralized configuration for magic values across the app
 */

/**
 * Storage keys for AsyncStorage/localStorage
 */
export const STORAGE_KEYS = {
  SESSION: 'session',
  USER_LANGUAGE: 'user-language',
  THEME: 'theme-preference',
  MAP_BOUNDS: 'map-bounds',
  LAST_VIEWED_MARINA: 'last-viewed-marina',
  ONBOARDING_COMPLETED: 'onboarding-completed',
} as const;

/**
 * Map-related constants
 */
export const MAP_CONSTANTS = {
  // Default home coordinate (Flensburg Harbor)
  HOME_COORDINATE: [9.26, 54.47926] as [number, number],

  // Zoom levels
  ZOOM_LEVELS: {
    MIN: 3,
    MAX: 18,
    DEFAULT: 7,
    SENSOR_DETAIL: 12,
  },

  // Map boundaries (Europe focus)
  BOUNDARIES: {
    NE: [49.869301, 71.185001] as [number, number],
    SW: [-31.266001, 27.560001] as [number, number],
  },

  // Animation durations (ms)
  ANIMATION: {
    HIGHLIGHT_DURATION: 3000,
    CAMERA_DURATION: 500,
    MARKER_FADE: 300,
  },

  // Clustering
  CLUSTER: {
    RADIUS: 50,
    MAX_ZOOM: 15,
  },
} as const;

/**
 * UI/UX constants
 */
export const UI_CONSTANTS = {
  // Toast notification durations (ms)
  TOAST_DURATION: {
    SHORT: 2000,
    MEDIUM: 3000,
    LONG: 5000,
  },

  // Debounce delays (ms)
  DEBOUNCE: {
    SEARCH: 300,
    RESIZE: 150,
    SCROLL: 100,
  },

  // Animation speeds
  ANIMATION_SPEED: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
} as const;

/**
 * API-related constants
 */
export const API_CONSTANTS = {
  // Request timeouts (ms)
  TIMEOUT: {
    DEFAULT: 10000,
    UPLOAD: 30000,
    DOWNLOAD: 60000,
  },

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000,
    BACKOFF_MULTIPLIER: 2,
  },

  // Cache durations (ms)
  CACHE: {
    SENSOR_DATA: 5 * 60 * 1000,      // 5 minutes
    LOCATION_DATA: 10 * 60 * 1000,   // 10 minutes
    USER_PROFILE: 15 * 60 * 1000,    // 15 minutes
  },
} as const;

/**
 * Validation constants
 */
export const VALIDATION = {
  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: false,
  },

  // Email
  EMAIL: {
    MAX_LENGTH: 255,
  },

  // Username
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
  },
} as const;

/**
 * Measurement-related constants
 */
export const MEASUREMENT_CONSTANTS = {
  // Refresh intervals (ms)
  REFRESH_INTERVAL: {
    LIVE_DATA: 30000,        // 30 seconds
    DASHBOARD: 60000,        // 1 minute
    BACKGROUND: 300000,      // 5 minutes
  },

  // Data precision (decimal places)
  PRECISION: {
    TEMPERATURE: 1,
    DISTANCE: 1,
    PRESSURE: 0,
    PERCENTAGE: 0,
    VOLTAGE: 2,
  },

  // Thresholds
  THRESHOLDS: {
    BATTERY_LOW: 3.3,        // Volts
    BATTERY_CRITICAL: 3.0,   // Volts
  },
} as const;

/**
 * Date/Time constants
 */
export const TIME_CONSTANTS = {
  // Time range options (for charts)
  RANGES: {
    TODAY: '24h',
    YESTERDAY: '48h',
    LAST_7_DAYS: '7d',
    LAST_30_DAYS: '30d',
    LAST_90_DAYS: '90d',
    LAST_180_DAYS: '180d',
    LAST_YEAR: '1y',
  },

  // Display formats
  FORMATS: {
    DISPLAY_DATE: 'DD.MM.YYYY',
    DISPLAY_TIME: 'HH:mm',
    DISPLAY_DATETIME: 'DD.MM.YYYY HH:mm',
    ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  },
} as const;

/**
 * Feature flags
 */
export const FEATURE_FLAGS = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_FAVORITES: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_ANALYTICS: true,
  ENABLE_BETA_FEATURES: false,
} as const;

/**
 * App metadata
 */
export const APP_METADATA = {
  NAME: 'MARLIN',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@marlin-live.com',
  WEBSITE: 'https://projekt.marlin-live.com',
  API_DOCS: 'https://api.marlin-live.com/docs',
} as const;
