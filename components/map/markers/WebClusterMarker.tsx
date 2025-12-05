import React, { useMemo } from 'react';
import { Marker } from '@vis.gl/react-maplibre';
import { ClusterMarkerSvg } from './ClusterMarkerSvg';
import { useThemeContext } from '@/context/ThemeSwitch';
import { YStack } from 'tamagui';

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
 * Shows clustered sensor markers with count and animation
 */
const WebClusterMarker = ({ latitude, longitude, pointCount, onClick, isDark: isDarkProp }: ClusterMarkerProps) => {
  const { isDark } = useThemeContext();
  const isActuallyDark = isDarkProp ?? isDark;

  // Memoize color calculation to avoid recalculation
  const accentColor = useMemo(
    () => (!isActuallyDark ? '#006e99' : '#7db07d'),
    [isActuallyDark]
  );

  const handleClusterClick = (e: any) => {
    e.originalEvent.stopPropagation();
    onClick?.();
  };

  return (
    <Marker
      latitude={latitude}
      longitude={longitude}
      anchor="center"
      onClick={handleClusterClick}
    >
      <YStack cursor="pointer">
        <ClusterMarkerSvg count={pointCount} accentColor={accentColor} enableAnimations={true} />
      </YStack>
    </Marker>
  );
};

WebClusterMarker.displayName = 'WebClusterMarker';

export default React.memo(WebClusterMarker, arePropsEqual);
