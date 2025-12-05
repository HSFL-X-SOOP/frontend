import React from 'react';

interface GPSMarkerProps {
  latitude: number;
  longitude: number;
  onPress?: () => void;
}

/**
 * GPS/User location marker component
 */
export const GPSMarker = React.memo(
  ({ latitude, longitude, onPress }: GPSMarkerProps) => {
    // Placeholder: Real implementation would show user's current location
    return null;
  }
);

GPSMarker.displayName = 'GPSMarker';

export default GPSMarker;
