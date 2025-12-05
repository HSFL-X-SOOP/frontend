import React from 'react';

interface ClusterMarkerProps {
  cluster: any;
  isDark?: boolean;
  onPress?: () => void;
}

/**
 * Native cluster marker component for MapLibre React Native
 */
export const ClusterMarker = React.memo(
  ({ cluster, isDark, onPress }: ClusterMarkerProps) => {
    // Placeholder: Real implementation would render MapLibre MarkerView with cluster count
    return null;
  }
);

ClusterMarker.displayName = 'ClusterMarker';

export default ClusterMarker;
