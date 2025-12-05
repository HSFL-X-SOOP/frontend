import React from 'react';
import { LocationWithBoxes } from '@/api/models/sensor';

interface SensorMarkerProps {
  locationWithBoxes: LocationWithBoxes;
  isDark?: boolean;
  onPress?: () => void;
}

/**
 * Native sensor marker component for MapLibre React Native
 */
export const SensorMarker = React.memo(
  ({ locationWithBoxes, isDark, onPress }: SensorMarkerProps) => {
    // Placeholder: Real implementation would render MapLibre MarkerView
    return null;
  }
);

SensorMarker.displayName = 'SensorMarker';

export default SensorMarker;
