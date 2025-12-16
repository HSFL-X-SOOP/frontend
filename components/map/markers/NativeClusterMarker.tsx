import React from 'react';
import {PointAnnotation} from '@maplibre/maplibre-react-native';
import {View} from 'react-native';
import {ClusterMarkerSvg} from './ClusterMarkerSvg';
import {useThemeContext} from '@/context/ThemeSwitch';

interface ClusterMarkerProps {
    latitude: number;
    longitude: number;
    pointCount: number;
    clusterId: number;
    onPress?: () => void;
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
                                 onPress
                             }: ClusterMarkerProps) => {
    const {isDark} = useThemeContext();

    const accentColor = !isDark ? '#006e99' : 'rgb(91,138,246)';
    const backgroundColor = isDark ? 'rgba(237,245,253,0.9)' : '#1c1c1c';
    const textColor = isDark ? '#010107' : 'white';
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
                    backgroundColor={backgroundColor}
                    textColor={textColor}
                    enableAnimations={true}
                />
            </View>
        </PointAnnotation>
    );
};

NativeClusterMarker.displayName = 'NativeClusterMarker';

export default React.memo(NativeClusterMarker, arePropsEqual);
