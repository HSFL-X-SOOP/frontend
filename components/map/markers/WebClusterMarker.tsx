import React from 'react';
import {Marker} from '@vis.gl/react-maplibre';
import {ClusterMarkerSvg} from './ClusterMarkerSvg';
import {useThemeContext} from '@/context/ThemeSwitch';
import {YStack} from 'tamagui';

interface ClusterMarkerProps {
    latitude: number;
    longitude: number;
    pointCount: number;
    onClick?: () => void;
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
        prevProps.onClick === nextProps.onClick
    );
};

/**
 * Web cluster marker component for react-map-gl
 * Memoized to prevent unnecessary re-renders when parent re-renders
 * Shows clustered sensor markers with count and animation
 */
const WebClusterMarker = ({latitude, longitude, pointCount, onClick}: ClusterMarkerProps) => {
    const {isDark} = useThemeContext();


    const accentColor = !isDark ? '#006e99' : 'rgb(91,138,246)';
    const backgroundColor = isDark ? 'rgba(237,245,253,0.9)' : '#1c1c1c';
    const textColor = isDark ? '#010107' : 'white';
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
                <ClusterMarkerSvg count={pointCount} accentColor={accentColor} backgroundColor={backgroundColor}
                                  textColor={textColor} enableAnimations={true}/>
            </YStack>
        </Marker>
    );
};

WebClusterMarker.displayName = 'WebClusterMarker';

export default React.memo(WebClusterMarker, arePropsEqual);
