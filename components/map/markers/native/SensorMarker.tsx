import {LocationWithBoxes} from "@/api/models/sensor";
import {PointAnnotation} from "@maplibre/maplibre-react-native";
import React, {useState} from "react";
import {Pressable} from "react-native";
import {SensorPopup} from "../../sensors/MapSensorMeasurements";
import {SensorMarkerContent} from "../../sensors/MapSensorTemperatureText";
import {Dialog, YStack, Button, Unspaced} from "tamagui";
import {X} from "@tamagui/lucide-icons";

interface SensorMarkerProps {
    locationWithBoxes: LocationWithBoxes;
    index?: number;
}

export default function SensorMarker({locationWithBoxes}: SensorMarkerProps) {
    const [open, setOpen] = useState(false);

    const handleMarkerPress = () => {
        setOpen(true);
    };

    return (
        <>
            <PointAnnotation
                id={`marker-${locationWithBoxes.location.id}`}
                key={`marker-${locationWithBoxes.location.id}`}
                coordinate={[
                    locationWithBoxes.location.coordinates.lon,
                    locationWithBoxes.location.coordinates.lat,
                ]}
                onSelected={handleMarkerPress}
            >
                <Pressable onPress={handleMarkerPress}>
                    <SensorMarkerContent locationWithBoxes={locationWithBoxes} isHovered={false}/>
                </Pressable>
            </PointAnnotation>

            <Dialog modal open={open} onOpenChange={setOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay
                        key="overlay"
                        animation="quick"
                        opacity={0.5}
                        enterStyle={{opacity: 0}}
                        exitStyle={{opacity: 0}}
                        onPress={() => setOpen(false)}
                    />

                    <Dialog.Content
                        bordered
                        key="content"
                        borderColor={"transparent"}
                        animateOnly={['transform', 'opacity']}
                        backgroundColor={"transparent"}
                        animation={[
                            'quick',
                            {
                                opacity: {
                                    overshootClamping: true,
                                },
                            },
                        ]}
                        enterStyle={{x: 0, y: -20, opacity: 0, scale: 0.9}}
                        exitStyle={{x: 0, y: 10, opacity: 0, scale: 0.95}}
                        gap="$4"
                        maxWidth={600}
                        maxHeight="80%"
                    >
                        <Dialog.Title display="none" />
                        <Dialog.Description display="none" />

                        <Unspaced>
                            <Dialog.Close asChild>
                                <Button
                                    position="absolute"
                                    top="$3"
                                    right="$3"
                                    size="$2"
                                    circular
                                    icon={X}
                                    zIndex={1000}
                                />
                            </Dialog.Close>
                        </Unspaced>

                        <YStack>
                            <SensorPopup
                                locationWithBoxes={locationWithBoxes}
                                closeOverlay={() => setOpen(false)}
                            />
                        </YStack>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>
        </>
    );
}
