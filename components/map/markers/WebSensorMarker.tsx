import React, { useState, useMemo } from 'react';
import { LocationWithBoxes } from '@/api/models/sensor';
import { Marker } from '@vis.gl/react-maplibre';
import { SensorMarkerContent } from '../sensors/MapSensorTemperatureText';
import { Popover, Dialog, YStack } from 'tamagui';
import { SensorPopup } from '../sensors/MapSensorMeasurements';
import { useIsMobileWeb } from '@/hooks/ui';

interface SensorMarkerProps {
  locationWithBoxes: LocationWithBoxes;
  isDark?: boolean;
  onPress?: () => void;
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
 * Web sensor marker component for react-map-gl
 * Memoized to prevent unnecessary re-renders when parent re-renders
 * Shows sensor data on map with interactive popover/dialog
 */
const WebSensorMarker = ({ locationWithBoxes, isDark, onPress }: SensorMarkerProps) => {
  const [open, setOpen] = useState(false);
  const isMobileWeb = useIsMobileWeb();

  // Memoize marker position to avoid recalculation
  const markerCoordinates = useMemo(
    () => ({
      longitude: locationWithBoxes.location?.coordinates.lon ?? 0,
      latitude: locationWithBoxes.location?.coordinates.lat ?? 0,
      id: locationWithBoxes.location?.id ?? 0,
    }),
    [locationWithBoxes.location?.coordinates.lon, locationWithBoxes.location?.coordinates.lat, locationWithBoxes.location?.id]
  );

  const handleMarkerPress = (e: any) => {
    e.stopPropagation();
    setOpen(true);
    onPress?.();
  };

  // Mobile web uses Dialog instead of Popover
  if (isMobileWeb) {
    return (
      <>
        <Marker
          key={markerCoordinates.id}
          longitude={markerCoordinates.longitude}
          latitude={markerCoordinates.latitude}
          anchor="bottom"
        >
          <YStack
            onPress={handleMarkerPress}
            cursor="pointer"
          >
            <SensorMarkerContent locationWithBoxes={locationWithBoxes} />
          </YStack>
        </Marker>

        <Dialog modal open={open} onOpenChange={setOpen}>
          <Dialog.Portal>
            <Dialog.Overlay
              key="overlay"
              animation="quick"
              opacity={0.5}
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
            <Dialog.Content
              bordered
              elevate
              key="content"
              animateOnly={['transform', 'opacity']}
              animation={[
                'quick',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
              enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
              exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
              padding="$0"
            >
              <SensorPopup locationWithBoxes={locationWithBoxes} closeOverlay={() => setOpen(false)} />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      </>
    );
  }

  // Desktop uses Popover
  return (
    <Marker
      key={markerCoordinates.id}
      longitude={markerCoordinates.longitude}
      latitude={markerCoordinates.latitude}
      anchor="center"
    >
      <Popover
        size="$5"
        allowFlip
        placement="left"
        open={open}
        onOpenChange={setOpen}
      >
        <Popover.Trigger asChild>
          <YStack
            onPress={handleMarkerPress}
            cursor="pointer"
          >
            <SensorMarkerContent locationWithBoxes={locationWithBoxes} />
          </YStack>
        </Popover.Trigger>

        <Popover.Content
          borderWidth={1}
          padding="$0"
          borderColor="$borderColor"
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
          elevate
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <Popover.Arrow borderWidth={1} backgroundColor="$content4" />
          <SensorPopup locationWithBoxes={locationWithBoxes} closeOverlay={() => setOpen(false)} />
        </Popover.Content>
      </Popover>
    </Marker>
  );
};

WebSensorMarker.displayName = 'WebSensorMarker';

export default React.memo(WebSensorMarker, arePropsEqual);
