import React from 'react';

interface GPSMarkerProps {
  latitude: number;
  longitude: number;
  onPress?: () => void;
}

/**
 * Custom comparison function to prevent unnecessary re-renders
 * Only re-render if coordinates or callback changes
 */
const arePropsEqual = (prevProps: GPSMarkerProps, nextProps: GPSMarkerProps): boolean => {
  return (
    prevProps.latitude === nextProps.latitude &&
    prevProps.longitude === nextProps.longitude &&
    prevProps.onPress === nextProps.onPress
  );
};

/**
 * GPS/User location marker component
 * Memoized to prevent unnecessary re-renders when parent re-renders
 */
export const GPSMarker = React.memo(
  ({ latitude, longitude, onPress }: GPSMarkerProps) => {
    // Placeholder: Real implementation would show user's current location
    return null;
  },
  arePropsEqual
);

GPSMarker.displayName = 'GPSMarker';

export default GPSMarker;
