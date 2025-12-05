import React from 'react';
import {BoxType, LocationWithBoxes} from '@/api/models/sensor';
import {useTranslation} from '@/hooks/useTranslation';
import {formatTimeToLocal} from '@/utils/time';
import {Activity, MapPin, Thermometer, Wind} from '@tamagui/lucide-icons';
import {Card, H4, Text, XStack, YStack} from 'tamagui';

interface SensorListItemProps {
    locationWithBoxes: LocationWithBoxes;
    onPress: () => void;
    isHighlighted?: boolean;
}

/**
 * Custom comparison function to prevent unnecessary re-renders
 * Only re-render if sensor ID, highlighted state, or callback changes
 */
const arePropsEqual = (prevProps: SensorListItemProps, nextProps: SensorListItemProps): boolean => {
    return (
        prevProps.locationWithBoxes?.location?.id === nextProps.locationWithBoxes?.location?.id &&
        prevProps.isHighlighted === nextProps.isHighlighted &&
        prevProps.onPress === nextProps.onPress
    );
};

/**
 * Sensor list item component
 * Memoized to prevent unnecessary re-renders when parent re-renders
 */
function SensorListItem({
                            locationWithBoxes,
                            onPress,
                            isHighlighted = false
                        }: SensorListItemProps) {
    const {t} = useTranslation();

    const getKeyMeasurements = () => {
        const measurements: Array<{ label: string; value: string; icon: React.ReactNode }> = [];

        for (const box of locationWithBoxes.boxes) {
            if (!box.measurementTimes[0]) continue;

            if (box.type === BoxType.WaterBox) {
                const m = box.measurementTimes[0].measurements;
                measurements.push({
                    label: t('sensor.waterTemperature'),
                    value: `${Math.round(m.waterTemperature * 10) / 10}°C`,
                    icon: <Thermometer size={14} color="#F97316"/>
                });
                measurements.push({
                    label: t('sensor.waterLevel'),
                    value: `${Math.round(m.tide)}cm`,
                    icon: <Activity size={14} color="#3B82F6"/>
                });
            } else if (box.type === BoxType.WaterTemperatureOnlyBox) {
                const m = box.measurementTimes[0].measurements;
                measurements.push({
                    label: t('sensor.waterTemperature'),
                    value: `${Math.round(m.waterTemperature * 10) / 10}°C`,
                    icon: <Thermometer size={14} color="#F97316"/>
                });
            } else if (box.type === BoxType.AirBox) {
                const m = box.measurementTimes[0].measurements;
                measurements.push({
                    label: t('sensor.airTemperature'),
                    value: `${Math.round(m.airTemperature * 10) / 10}°C`,
                    icon: <Thermometer size={14} color="#F97316"/>
                });
                measurements.push({
                    label: t('sensor.windSpeed'),
                    value: `${Math.round(m.windSpeed * 10) / 10}m/s`,
                    icon: <Wind size={14} color="#10B981"/>
                });
            }
        }

        return measurements.slice(0, 3);
    };

    const keyMeasurements = getKeyMeasurements();

    const getLastMeasurementTime = () => {
        for (const box of locationWithBoxes.boxes) {
            if (box.measurementTimes[0]) {
                return formatTimeToLocal(box.measurementTimes[0].time + 'Z');
            }
        }
        return t('sensor.noData');
    };

    return (
        <Card
            bordered
            padding="$3"
            marginHorizontal="$3"
            marginVertical="$2"
            height={210}
            backgroundColor={isHighlighted ? '$accent2' : '$content1'}
            borderColor={isHighlighted ? '$accent8' : '$borderColor'}
            borderWidth={isHighlighted ? 2 : 1}
            onPress={onPress}
            pressStyle={{
                scale: 0.98,
                backgroundColor: '$content2'
            }}
            hoverStyle={{
                scale: 1.01,
                borderColor: '$accent6',
                cursor: 'pointer'
            }}
            animation="quick"
        >
            <YStack flex={1} justifyContent="space-between">
                <YStack gap="$2.5">
                    {/* Header: Location Name */}
                    <XStack gap="$2" alignItems="center">
                        <MapPin size={16} color="$color"/>
                        <H4 fontSize="$5" fontWeight="600" color="$color" numberOfLines={1} flex={1}>
                            {locationWithBoxes.location?.name || 'Unknown'}
                        </H4>
                    </XStack>

                    {/* Key Measurements */}
                    <YStack gap="$2">
                        {keyMeasurements.map((measurement, index) => (
                            <XStack
                                key={index}
                                padding="$2"
                                backgroundColor="$content2"
                                borderRadius="$2"
                                alignItems="center"
                                gap="$1.5"
                            >
                                <YStack
                                    width={24}
                                    height={24}
                                    borderRadius="$2"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    {measurement.icon}
                                </YStack>
                                <YStack flex={1}>
                                    <Text fontSize="$1" color="$gray11" numberOfLines={1}>
                                        {measurement.label}
                                    </Text>
                                    <Text fontSize="$3" fontWeight="700" color="$color">
                                        {measurement.value}
                                    </Text>
                                </YStack>
                            </XStack>
                        ))}
                    </YStack>
                </YStack>

                {/* Last Measurement Time - positioned at bottom */}
                <XStack
                    alignItems="center"
                    gap="$1.5"
                    padding="$2"
                    backgroundColor="$content3"
                    borderRadius="$2"
                >
                    <Activity size={12} color="$green10"/>
                    <Text fontSize="$1" color="$gray11">
                        {t('sensor.lastMeasurement')}:{' '}
                        <Text fontWeight="600" color="$color">
                            {getLastMeasurementTime()}
                        </Text>
                    </Text>
                </XStack>
            </YStack>
        </Card>
    );
}

SensorListItem.displayName = 'SensorListItem';

export default React.memo(SensorListItem, arePropsEqual);
