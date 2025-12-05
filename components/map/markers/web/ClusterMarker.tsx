import React from 'react';

interface ClusterMarkerProps {
  latitude: number;
  longitude: number;
  pointCount: number;
  onClick?: () => void;
  isDark?: boolean;
}

/**
 * Web cluster marker component for react-map-gl
 * Placeholder implementation - actual implementation would render react-map-gl Marker
 */
export const ClusterMarker = React.memo(
  ({ latitude, longitude, pointCount, onClick, isDark }: ClusterMarkerProps) => {
    // TODO: Render actual react-map-gl Marker with cluster visualization
    return null;
  }
);

ClusterMarker.displayName = 'ClusterMarker';

export default ClusterMarker;
