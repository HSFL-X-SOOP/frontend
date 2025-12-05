import React from 'react';
import { LocationWithBoxes } from '@/api/models/sensor';

interface SensorMarkerProps {
  locationWithBoxes: LocationWithBoxes;
  isDark?: boolean;
  onPress?: () => void;
}

/**
 * Custom comparison function to prevent unnecessary re-renders
 * Only re-render if sensor ID or dark mode changes
 */
const arePropsEqual = (prevProps: SensorMarkerProps, nextProps: SensorMarkerProps): boolean => {
  return (
    prevProps.locationWithBoxes.location.id === nextProps.locationWithBoxes.location.id &&
    prevProps.isDark === nextProps.isDark &&
    prevProps.onPress === nextProps.onPress
  );
};

/**
 * Web sensor marker component for react-map-gl
 * Memoized to prevent unnecessary re-renders when parent re-renders
 */
export const SensorMarker = React.memo(
  ({ locationWithBoxes, isDark, onPress }: SensorMarkerProps) => {
    // Placeholder: Real implementation would render react-map-gl Marker
    return null;
  },
  arePropsEqual
);

SensorMarker.displayName = 'SensorMarker';

export default SensorMarker;
