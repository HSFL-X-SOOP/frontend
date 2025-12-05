import {BoxType, LocationWithBoxes} from "@/api/models/sensor";
import {useTranslation} from "@/hooks/useTranslation";
import {formatTimeToLocal} from "@/utils/time";
import type {TFunction} from 'i18next';
import {
    Activity,
    ArrowRight,
    Battery,
    Compass,
    Droplets,
    Gauge,
    HelpCircle,
    MapPin,
    Thermometer,
    Waves,
    Wind
} from "@tamagui/lucide-icons";
import {LinearGradient} from "expo-linear-gradient";
import {useRouter} from "expo-router";
import {useState} from "react";
import {Button, Card, H3, H4, Separator, Text, XStack, YStack, useTheme} from "tamagui";

type SensorPopupProps = {
    locationWithBoxes: LocationWithBoxes,
    closeOverlay?: () => void
}

export const SensorPopup: React.FC<SensorPopupProps> = ({
                                                            locationWithBoxes,
                                                            closeOverlay
                                                        }) => {
    const router = useRouter();
    const {t} = useTranslation();
    const theme = useTheme();

    const [selectedBoxIndex, setSelectedBoxIndex] = useState(0);
    const hasMultipleBoxes = locationWithBoxes.boxes.length > 1;

    const cardWidth = 350;

    const handleNavigateToDashboard = () => {
        router.push(`/marina/${locationWithBoxes.location.name}`);
        setTimeout(() => {
            closeOverlay?.();
        }, 100);
    };

    return (
        <Card
            elevate
            bordered
            width={cardWidth}
            borderRadius="$5"
            padding="$0"
            overflow="hidden"
            borderWidth={1}
            borderColor="$borderColor"
        >
            {/* Header with Gradient Background */}
            <YStack>
                <LinearGradient
                    colors={[theme.accent8?.val, theme.accent7?.val, theme.accent6?.val]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={{padding: 14}}
                >
                    <XStack alignItems="center" gap="$2.5">
                        <YStack
                            width={38}
                            height={38}
                            borderRadius="$3"
                            backgroundColor="rgba(255,255,255,0.2)"
                            alignItems="center"
                            justifyContent="center"
                            borderWidth={1}
                            borderColor="rgba(255,255,255,0.3)"
                        >
                            <MapPin size={24} color="white"/>
                        </YStack>
                        <YStack flex={1}>
                            <Text fontSize="$1" color="rgba(255,255,255,0.85)" fontWeight="500">
                                {t('sensor.location')}
                            </Text>
                            <H3 fontSize="$7" fontWeight="700" color="white" numberOfLines={1}>
                                {locationWithBoxes.location.name}
                            </H3>
                        </YStack>
                    </XStack>
                </LinearGradient>
            </YStack>

            <YStack padding="$3" gap="$3" backgroundColor="$background">
                {hasMultipleBoxes && (
                    <XStack gap="$2" flexWrap="wrap">
                        {locationWithBoxes.boxes.map((box, index) => (
                            <Button
                                key={index}
                                size="$3"
                                flex={1}
                                minWidth={80}
                                variant={"outlined"}
                                backgroundColor="$content2"
                                color="$color"
                                onPress={() => setSelectedBoxIndex(index)}
                                borderWidth={selectedBoxIndex === index ? 1 : 0}
                                borderColor="$gray10"
                                pressStyle={{
                                    backgroundColor: '$gray5',
                                    scale: 0.97
                                }}
                                hoverStyle={{
                                    backgroundColor: '$gray5',
                                    borderColor: selectedBoxIndex === index ? '$blue10' : '$gray6'
                                }}
                                borderRadius="$3"
                                fontWeight={selectedBoxIndex === index ? '700' : '500'}
                                fontSize="$3"
                            >
                                {getBoxTypeName(box.type, t)}
                            </Button>
                        ))}
                    </XStack>
                )}

                {hasMultipleBoxes ? (
                    <BoxMeasurements box={locationWithBoxes.boxes[selectedBoxIndex]}/>
                ) : (
                    locationWithBoxes.boxes.map((box, index) => (
                        <BoxMeasurements key={index} box={box}/>
                    ))
                )}
            </YStack>

            {/* Footer - Dashboard Button */}
            <YStack padding="$3" paddingTop="$2.5" backgroundColor="$background">
                <Button
                    size="$3"
                    backgroundColor="$accent5"
                    color="white"
                    width="100%"
                    onPress={handleNavigateToDashboard}
                    iconAfter={<ArrowRight size={18}/>}
                    pressStyle={{
                        backgroundColor: '$accent3',
                        scale: 0.98
                    }}
                    hoverStyle={{
                        backgroundColor: '$accent3',
                        scale: 1.01
                    }}
                    borderRadius="$3"
                    fontWeight="600"
                    userSelect="none"
                    fontSize="$4"
                >
                    {t('sensor.viewDashboard')}
                </Button>
            </YStack>
        </Card>
    );
}

type BoxMeasurementsProps = {
    box: LocationWithBoxes['boxes'][0];
};

function BoxMeasurements({box}: BoxMeasurementsProps) {
    const {t} = useTranslation();

    if (!box.measurementTimes[0]) return null;

    return (
        <YStack gap="$2.5">
            <XStack
                alignItems="center"
                gap="$2"
                padding="$2"
                backgroundColor="$content2"
            >
                <YStack
                    width={26}
                    height={26}
                    borderRadius="$2"
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="$content3"
                >
                    {getBoxTypeIcon(box.type)}
                </YStack>
                <H4 fontSize="$3" fontWeight="600" color="$color">
                    {getBoxTypeName(box.type, t)}
                </H4>
            </XStack>

            <XStack flexWrap="wrap" gap="$2.5" justifyContent="space-between">
                {box.type === BoxType.WaterBox && (
                    <>
                        <MeasurementCard
                            measurementType="waterTemperature"
                            value={box.measurementTimes[0].measurements.waterTemperature}
                        />
                        <MeasurementCard
                            measurementType="waveHeight"
                            value={box.measurementTimes[0].measurements.waveHeight}
                        />
                        <MeasurementCard
                            measurementType="waterLevel"
                            value={box.measurementTimes[0].measurements.tide}
                        />
                    </>
                )}

                {box.type === BoxType.WaterTemperatureOnlyBox && (
                    <MeasurementCard
                        measurementType="waterTemperature"
                        value={box.measurementTimes[0].measurements.waterTemperature}
                    />
                )}

                {box.type === BoxType.AirBox && (
                    <>
                        <MeasurementCard
                            measurementType="airTemperature"
                            value={box.measurementTimes[0].measurements.airTemperature}
                        />
                        <MeasurementCard
                            measurementType="windSpeed"
                            value={box.measurementTimes[0].measurements.windSpeed}
                        />
                        <MeasurementCard
                            measurementType="humidity"
                            value={box.measurementTimes[0].measurements.humidity}
                        />
                        <MeasurementCard
                            measurementType="airPressure"
                            value={box.measurementTimes[0].measurements.airPressure}
                        />
                    </>
                )}
            </XStack>

            <XStack
                alignItems="center"
                gap="$1.5"
                padding="$2"
                backgroundColor="$content3"
                borderRadius="$2"
            >
                <Activity size={16} color="$green10"/>
                <Text fontSize="$1" color="$color" fontWeight="500">
                    {t('sensor.lastMeasurement')}: <Text fontWeight="600" color="$color">
                    {formatTimeToLocal(box.measurementTimes[0].time + "Z")}
                </Text>
                </Text>
            </XStack>
            <Separator/>
        </YStack>
    );
}

type MeasurementCardProps = {
    measurementType: string;
    value: number;
};

function MeasurementCard({measurementType, value}: MeasurementCardProps) {
    const {t} = useTranslation();

    const {icon, color} = getMeasurementIcon(measurementType);

    return (
        <Card
            width="100%"
            backgroundColor="$content2"
            padding="$2.5"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$borderColor"
            pressStyle={{scale: 0.97, opacity: 0.9}}
            hoverStyle={{scale: 1.02, borderColor: color}}
            animation={[
                'quick',
                {
                    scale: {
                        overshootClamping: true,
                    },
                },
            ]}
            elevate
        >
            <XStack gap={"$2"} justifyContent={"space-between"} alignItems={"center"}>
                <YStack
                    width={36}
                    height={36}
                    borderRadius="$2"
                    alignItems="center"
                    justifyContent="center"
                >
                    {icon}
                </YStack>
                <Text fontSize="$5" color="$color" fontWeight="500" numberOfLines={2}
                      lineHeight="$1">
                    {getMeasurementLabel(measurementType, t)}
                </Text>

                <XStack alignItems="baseline" gap="$1">
                    <Text fontSize="$7" fontWeight="800" color={color} letterSpacing={-0.5}>
                        {Math.round(value * 10) / 10}
                    </Text>
                    <Text fontSize="$3" color="$gray10" fontWeight="700">
                        {getMeasurementUnit(measurementType, t)}
                    </Text>
                </XStack>
            </XStack>
        </Card>
    );
}

function getBoxTypeIcon(boxType: BoxType) {
    const size = 14;
    switch (boxType) {
        case BoxType.WaterBox:
            return <Waves size={size} color="$blue10"/>;
        case BoxType.WaterTemperatureOnlyBox:
            return <Thermometer size={size} color="$orange10"/>;
        case BoxType.AirBox:
            return <Wind size={size} color="$green10"/>;
        default:
            return <HelpCircle size={size} color="$gray10"/>;
    }
}

function getBoxTypeName(boxType: BoxType, t: TFunction): string {
    switch (boxType) {
        case BoxType.WaterBox:
            return t('sensor.waterBox');
        case BoxType.WaterTemperatureOnlyBox:
            return t('sensor.waterTemperatureBox');
        case BoxType.AirBox:
            return t('sensor.airBox');
        default:
            return boxType;
    }
}

function getMeasurementIcon(measurementType: string): { icon: React.ReactNode; color: string; bgColor: string } {
    const size = 18;

    switch (measurementType) {
        case "waterTemperature":
            return {
                icon: <Thermometer size={size} color="#F97316"/>,
                color: "#F97316",
                bgColor: "#FED7AA"
            };
        case "waveHeight":
            return {
                icon: <Waves size={size} color="#10B981"/>,
                color: "#10B981",
                bgColor: "#A7F3D0"
            };
        case "waterLevel":
            return {
                icon: <Activity size={size} color="#3B82F6"/>,
                color: "#3B82F6",
                bgColor: "#BFDBFE"
            };
        case "airTemperature":
            return {
                icon: <Thermometer size={size} color="$red10"/>,
                color: "$red10",
                bgColor: "$red4"
            };
        case "windSpeed":
            return {
                icon: <Wind size={size} color="$green10"/>,
                color: "$green10",
                bgColor: "$green4"
            };
        case "windDirection":
            return {
                icon: <Compass size={size} color="$purple10"/>,
                color: "$purple10",
                bgColor: "$purple4"
            };
        case "humidity":
            return {
                icon: <Droplets size={size} color="$blue10"/>,
                color: "$blue10",
                bgColor: "$blue4"
            };
        case "airPressure":
            return {
                icon: <Gauge size={size} color="$gray10"/>,
                color: "$gray10",
                bgColor: "$gray4"
            };
        case "batteryVoltage":
            return {
                icon: <Battery size={size} color="$yellow10"/>,
                color: "$yellow10",
                bgColor: "$yellow4"
            };
        default:
            return {
                icon: <HelpCircle size={size} color="$gray10"/>,
                color: "$gray10",
                bgColor: "$gray4"
            };
    }
}

function getMeasurementLabel(measurementType: string, t: TFunction): string {
    switch (measurementType) {
        case "waterTemperature":
            return t('sensor.waterTemperature');
        case "waveHeight":
            return t('sensor.waveHeight');
        case "waterLevel":
            return t('sensor.waterLevel');
        case "airTemperature":
            return t('sensor.airTemperature');
        case "windSpeed":
            return t('sensor.windSpeed');
        case "windDirection":
            return t('sensor.windDirection');
        case "humidity":
            return t('sensor.humidity');
        case "airPressure":
            return t('sensor.airPressure');
        case "batteryVoltage":
            return t('sensor.batteryVoltage');
        default:
            return measurementType;
    }
}

function getMeasurementUnit(measurementType: string, t: TFunction): string {
    switch (measurementType) {
        case "waterTemperature":
        case "airTemperature":
            return t('dashboard.units.celsius');
        case "waveHeight":
        case "waterLevel":
            return t('dashboard.units.centimeters');
        case "windSpeed":
            return "m/s";
        case "windDirection":
            return "°";
        case "humidity":
            return "%";
        case "airPressure":
            return "hPa";
        case "batteryVoltage":
            return "V";
        default:
            return "";
    }
}
