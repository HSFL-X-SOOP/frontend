import React from 'react';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface GPSMarkerProps {
  latitude: number;
  longitude: number;
  size?: number;
  onPress?: () => void;
}

/**
 * Custom comparison function to prevent unnecessary re-renders
 * Only re-render if coordinates or size changes
 */
const arePropsEqual = (prevProps: GPSMarkerProps, nextProps: GPSMarkerProps): boolean => {
  return (
    prevProps.latitude === nextProps.latitude &&
    prevProps.longitude === nextProps.longitude &&
    prevProps.size === nextProps.size &&
    prevProps.onPress === nextProps.onPress
  );
};

/**
 * GPS/User location marker component
 * Memoized to prevent unnecessary re-renders when parent re-renders
 */
export const GPSMarker = React.memo(
  ({ latitude, longitude, size = 48, onPress }: GPSMarkerProps) => {
    return (
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#ff5a5f" />
            <Stop offset="1" stopColor="#ff393e" />
          </LinearGradient>
        </Defs>
        <Circle cx="32" cy="55" r="6" fill="rgba(0,0,0,0.2)" />
        <Path
          d="M32 2C19 2 9 12.5 9 25.5C9 42 32 62 32 62C32 62 55 42 55 25.5C55 12.5 45 2 32 2Z"
          fill="url(#grad)"
        />
        <Circle cx="32" cy="26" r="10" fill="white" />
      </Svg>
    );
  },
  arePropsEqual
);

GPSMarker.displayName = 'GPSMarker';

export default GPSMarker;
