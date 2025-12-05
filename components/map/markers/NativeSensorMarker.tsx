import React, { useState, useMemo } from 'react';
import { LocationWithBoxes } from '@/api/models/sensor';
import { PointAnnotation } from '@maplibre/maplibre-react-native';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SensorPopup } from '../sensors/MapSensorMeasurements';
import { SensorMarkerContent } from '../sensors/MapSensorTemperatureText';
import { Theme, YStack } from 'tamagui';
import { useThemeContext } from '@/context/ThemeSwitch';

interface SensorMarkerProps {
  locationWithBoxes: LocationWithBoxes;
  isDark?: boolean;
  onPress?: () => void;
  index?: number;
}

/**
 * Custom comparison function to prevent unnecessary re-renders
 * Only re-render if sensor ID, dark mode, or callback changes
 */
const arePropsEqual = (prevProps: SensorMarkerProps, nextProps: SensorMarkerProps): boolean => {
  return (
    prevProps.locationWithBoxes?.location?.id === nextProps.locationWithBoxes?.location?.id &&
    prevProps.isDark === nextProps.isDark &&
    prevProps.onPress === nextProps.onPress
  );
};

/**
 * Native sensor marker component for MapLibre React Native
 * Memoized to prevent unnecessary re-renders when parent re-renders
 * Shows sensor data on map with interactive modal popup
 */
const NativeSensorMarker = ({ locationWithBoxes, isDark, onPress }: SensorMarkerProps) => {
  const [open, setOpen] = useState(false);
  const { currentTheme } = useThemeContext();

  // Memoize marker position to avoid recalculation
  const markerCoordinates = useMemo(
    () => ({
      id: locationWithBoxes.location?.id ?? 0,
      lon: locationWithBoxes.location?.coordinates.lon ?? 0,
      lat: locationWithBoxes.location?.coordinates.lat ?? 0,
    }),
    [locationWithBoxes.location?.id, locationWithBoxes.location?.coordinates.lon, locationWithBoxes.location?.coordinates.lat]
  );

  const handleMarkerPress = () => {
    setOpen(true);
    onPress?.();
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <>
      <PointAnnotation
        id={`marker-${markerCoordinates.id}`}
        key={`marker-${markerCoordinates.id}`}
        coordinate={[markerCoordinates.lon, markerCoordinates.lat]}
        onSelected={handleMarkerPress}
      >
        <View>
          <SensorMarkerContent locationWithBoxes={locationWithBoxes} isHovered={false} />
        </View>
      </PointAnnotation>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <Pressable style={styles.overlay} onPress={handleCloseModal}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Theme name={currentTheme}>
              <YStack>
                <SensorPopup
                  locationWithBoxes={locationWithBoxes}
                  closeOverlay={handleCloseModal}
                />
              </YStack>
            </Theme>
          </Pressable>
        </Pressable>
      </Modal>
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
