import React from 'react';

interface ClusterMarkerProps {
  latitude: number;
  longitude: number;
  pointCount: number;
  onClick?: () => void;
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
    prevProps.isDark === nextProps.isDark &&
    prevProps.onClick === nextProps.onClick
  );
};

/**
 * Web cluster marker component for react-map-gl
 * Memoized to prevent unnecessary re-renders when parent re-renders
 * Placeholder implementation - actual implementation would render react-map-gl Marker
 */
export const ClusterMarker = React.memo(
  ({ latitude, longitude, pointCount, onClick, isDark }: ClusterMarkerProps) => {
    // TODO: Render actual react-map-gl Marker with cluster visualization
    return null;
  },
  arePropsEqual
);

ClusterMarker.displayName = 'ClusterMarker';

export default ClusterMarker;
