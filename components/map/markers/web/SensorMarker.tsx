import React from 'react';
import { LocationWithBoxes } from '@/api/models/sensor';

interface SensorMarkerProps {
  locationWithBoxes: LocationWithBoxes;
  isDark?: boolean;
  onPress?: () => void;
}

/**
 * Web sensor marker component for react-map-gl
 */
export const SensorMarker = React.memo(
  ({ locationWithBoxes, isDark, onPress }: SensorMarkerProps) => {
    // Placeholder: Real implementation would render react-map-gl Marker
    return null;
  }
);

SensorMarker.displayName = 'SensorMarker';

export default SensorMarker;
