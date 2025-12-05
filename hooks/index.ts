/**
 * Custom Hooks
 * Central export point for all custom hooks organized by category
 */

// Authentication Hooks
export { useAuth, useGoogleSignIn } from '@/hooks/auth';

// Data Fetching Hooks
export {
  useSensorDataNew,
  useSensorDataTimeRange,
  useLocations,
  useUser,
  useUserLocations,
  useLocationInfo,
} from '@/hooks/data';

// Map Hooks
export {
  useMapCamera,
  useMapFilters,
  useMapSpeedDialActions,
  useMapState,
  useMapStyle,
  useSupercluster,
} from '@/hooks/map';

// UI Hooks
export {
  useToast,
  ToastType,
  useLocalStorage,
  useNotificationLocations,
  useNotificationMeasurementRules,
  useTranslation,
  useViewportHeight,
  useIsMobileWeb,
  useIsMobile,
  usePasswordValidation,
  useEmailValidation,
  useUserDevice,
} from '@/hooks/ui';

// Core Utilities
export * from '@/hooks/core/asyncHandler';
