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
 * Custom comparison function to prevent unnecessary re-renders
 * Only re-render if cluster coordinates, count, or dark mode changes
 */
const arePropsEqual = (prevProps: ClusterMarkerProps, nextProps: ClusterMarkerProps): boolean => {
  return (
    prevProps.latitude === nextProps.latitude &&
    prevProps.longitude === nextProps.longitude &&
    prevProps.pointCount === nextProps.pointCount &&
    prevProps.clusterId === nextProps.clusterId &&
    prevProps.isDark === nextProps.isDark &&
    prevProps.onPress === nextProps.onPress
  );
};

/**
 * Native cluster marker component for MapLibre React Native
 * Memoized to prevent unnecessary re-renders when parent re-renders
 * Placeholder implementation - actual implementation would render MapLibre MarkerView
 */
export const ClusterMarker = React.memo(
  ({ latitude, longitude, pointCount, clusterId, onPress, isDark }: ClusterMarkerProps) => {
    // TODO: Render actual MapLibre MarkerView with cluster visualization
    return null;
  },
  arePropsEqual
);

ClusterMarker.displayName = 'ClusterMarker';

export default ClusterMarker;
