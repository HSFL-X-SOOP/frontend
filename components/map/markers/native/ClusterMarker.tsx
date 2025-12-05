import React from 'react';

interface ClusterMarkerProps {
  latitude: number;
  longitude: number;
  pointCount: number;
  clusterId: number;
  onPress?: () => void;
  isDark?: boolean;
}

/**
 * Native cluster marker component for MapLibre React Native
 * Placeholder implementation - actual implementation would render MapLibre MarkerView
 */
export const ClusterMarker = React.memo(
  ({ latitude, longitude, pointCount, clusterId, onPress, isDark }: ClusterMarkerProps) => {
    // TODO: Render actual MapLibre MarkerView with cluster visualization
    return null;
  }
);

ClusterMarker.displayName = 'ClusterMarker';

export default ClusterMarker;
