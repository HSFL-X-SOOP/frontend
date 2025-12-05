import React from 'react';

interface ClusterMarkerProps {
  cluster: any;
  isDark?: boolean;
  onPress?: () => void;
}

/**
 * Web cluster marker component for react-map-gl
 */
export const ClusterMarker = React.memo(
  ({ cluster, isDark, onPress }: ClusterMarkerProps) => {
    // Placeholder: Real implementation would render react-map-gl Marker with cluster count
    return null;
  }
);

ClusterMarker.displayName = 'ClusterMarker';

export default ClusterMarker;
