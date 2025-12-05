import React, { useMemo } from 'react';
import { PointAnnotation } from '@maplibre/maplibre-react-native';
import { View } from 'react-native';
import { ClusterMarkerSvg } from './ClusterMarkerSvg';
import { useThemeContext } from '@/context/ThemeSwitch';

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
 * Shows clustered sensor markers with count
 */
const NativeClusterMarker = ({
  latitude,
  longitude,
  pointCount,
  clusterId,
  onPress,
  isDark: isDarkProp,
}: ClusterMarkerProps) => {
  const { isDark } = useThemeContext();
  const isActuallyDark = isDarkProp ?? isDark;

  // Memoize color calculation to avoid recalculation
  const accentColor = useMemo(
    () => (!isActuallyDark ? '#006e99' : '#7db07d'),
    [isActuallyDark]
  );

  const handleClusterPress = () => {
    onPress?.();
  };

  return (
    <PointAnnotation
      id={`cluster-${clusterId}`}
      key={`cluster-${clusterId}`}
      coordinate={[longitude, latitude]}
      title="Cluster"
      onSelected={handleClusterPress}
    >
      <View>
        <ClusterMarkerSvg
          count={pointCount}
          accentColor={accentColor}
          enableAnimations={false}
        />
      </View>
    </PointAnnotation>
  );
};

NativeClusterMarker.displayName = 'NativeClusterMarker';

export default React.memo(NativeClusterMarker, arePropsEqual);
