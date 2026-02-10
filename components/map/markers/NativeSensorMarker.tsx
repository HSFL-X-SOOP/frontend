import React, {useMemo, useState} from 'react';
import {LocationWithBoxes} from '@/api/models/sensor';
import {PointAnnotation} from '@maplibre/maplibre-react-native';
import { StyleSheet, View} from 'react-native';
import {SensorMarkerContent} from '../sensors/MapSensorTemperatureText';

interface SensorMarkerProps {
    locationWithBoxes: LocationWithBoxes;
    metricToShow: string;
    isDark?: boolean;
    index?: number;
    selectedLocationId?: number;
    setMarker?: (locationWithBoxes: LocationWithBoxes) => void;
    setOpen?: (open: boolean) => void;
}

/**
 * Custom comparison function to prevent unnecessary re-renders
 * Only re-render if sensor ID, dark mode, or callback changes
 */

const arePropsEqual = (prevProps: SensorMarkerProps, nextProps: SensorMarkerProps): boolean => {
    return (
        prevProps.locationWithBoxes?.location?.id === nextProps.locationWithBoxes?.location?.id &&
        prevProps.isDark === nextProps.isDark &&
        prevProps.setMarker === nextProps.setMarker &&
        prevProps.setOpen === nextProps.setOpen &&
        prevProps.selectedLocationId === nextProps.selectedLocationId
    );
};

/**
 * Native sensor marker component for MapLibre React Native
 * Memoized to prevent unnecessary re-renders when parent re-renders
 * Shows sensor data on map with interactive modal popup
 */
const NativeSensorMarker = ({locationWithBoxes, metricToShow, setMarker, setOpen, selectedLocationId}: SensorMarkerProps) => {
    // Memoize marker position to avoid recalculation
    const markerCoordinates = useMemo(
        () => ({
            id: locationWithBoxes.location?.id ?? 0,
            lon: locationWithBoxes.location?.coordinates.lon ?? 0,
            lat: locationWithBoxes.location?.coordinates.lat ?? 0,
        }),
        [locationWithBoxes.location?.id, locationWithBoxes.location?.coordinates.lon, locationWithBoxes.location?.coordinates.lat]
    );

    return (
        <>
            <PointAnnotation
                id={`marker-${markerCoordinates.id}`}
                key={markerCoordinates.id + (selectedLocationId === markerCoordinates.id ? '_selected' : '')}
                coordinate={[markerCoordinates.lon, markerCoordinates.lat]}
                onSelected={() => {setMarker?.(locationWithBoxes); setOpen?.(true);}}
            >
                <View>
                    <SensorMarkerContent locationWithBoxes={locationWithBoxes} metricToShow={metricToShow}/>
                </View>
            </PointAnnotation>
        </>
    );
};

NativeSensorMarker.displayName = 'NativeSensorMarker';

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default React.memo(NativeSensorMarker, arePropsEqual);
