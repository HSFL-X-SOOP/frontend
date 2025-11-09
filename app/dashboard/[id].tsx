import {LocationWithBoxes} from '@/api/models/sensor';
import {LineChartCard} from '@/components/dashboard/chart/LineChartCard';
import {ChartTimeRange, TimeRangeDropdown} from '@/components/dashboard/chart/TimeRangeDropdown';
import {MeasurementCard} from '@/components/dashboard/MeasurementCard';
import {NavigateDashboardDropdownMenu} from '@/components/dashboard/NavigateDropdownMenu';
import {useThemeContext} from '@/context/ThemeSwitch';
import {useSensorDataNew, useSensorDataTimeRange} from '@/hooks/useSensors';
import {useTranslation} from '@/hooks/useTranslation';
import {ChartDataPoint} from '@/types/chart';
import {MarinaNameWithId} from '@/types/marina';
import {
    CreateMeasurementDictionary,
    GetLatestMeasurements,
    formatMeasurementValue,
    getMeasurementColor,
    getMeasurementIcon,
    getMeasurementTypeSymbol,
    getTextFromMeasurementType
} from '@/utils/measurements';
import {formatTimeToLocal} from '@/utils/time';
import {
    Activity,
    ChevronDown,
    ChevronUp,
    Clock,
    Home,
    MapPin,
    Thermometer,
    Waves
} from '@tamagui/lucide-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {useEffect, useMemo, useCallback, useRef, useState} from 'react';
import type {ComponentProps} from 'react';
import {Animated, LayoutChangeEvent, SafeAreaView, ScrollView, View} from 'react-native';
import {
    Button,
    Card,
    H1,
    H2,
    H3,
    Image,
    Separator,
    Stack,
    Text,
    XStack,
    YStack,
    useMedia
} from 'tamagui';

export default function DashboardScreen() {
    const media = useMedia();
    const router = useRouter();
    const {t} = useTranslation();
    const {isDark} = useThemeContext();
    const [showInfo, setShowInfo] = useState(false);
    const [infoContentHeight, setInfoContentHeight] = useState(0);
    const infoHeight = useRef(new Animated.Value(0)).current;
    let {id} = useLocalSearchParams();

    if (!id) {
        id = "4";
    }
    const [timeRange, setTimeRange] = useState<ChartTimeRange>('today');

    const {data: allSensorData} = useSensorDataNew();

    const GetAllAvailableSensorLocations = (data: LocationWithBoxes[]): MarinaNameWithId[] => {
        const locationMap = new Map<number, MarinaNameWithId>();

        data.forEach((element) => {
            if (element.location?.id && element.location?.name) {
                locationMap.set(element.location.id, {
                    id: element.location.id,
                    name: element.location.name
                });
            }
        });

        return Array.from(locationMap.values());
    }

    const sensorLocations = useMemo(
        () => GetAllAvailableSensorLocations(allSensorData),
        [allSensorData]
    );

    const isAdmin = false;

    const excludedMeasurements = useMemo(() => {
        const excluded = ["Standard deviation"];
        if (!isAdmin) {
            excluded.push("Battery, voltage");
        }
        return excluded;
    }, [isAdmin]);


    const [chartWaterTemperature, setChartWaterTemperature] = useState<ChartDataPoint[]>([])
    const [chartTide, setChartTide] = useState<ChartDataPoint[]>([])
    const [chartWaveHeight, setChartWaveHeight] = useState<ChartDataPoint[]>([])

    const apiTimeRange = useMemo(() => {
        switch (timeRange) {
            case 'yesterday':
                return '48h';
            case 'last7days':
                return '7d';
            case 'last30days':
                return '30d';
            case 'last90days':
                return '90d';
            case 'last180days':
                return '180d';
            case 'last1year':
                return '1y';
            default:
                return '24h';
        }
    }, [timeRange]);

    const {data: timeRangeData} = useSensorDataTimeRange(Number(id), apiTimeRange);

    const name = useMemo(() => timeRangeData?.location.name || "", [timeRangeData]);

    useEffect(() => {
        if (timeRangeData) {
            const measurementDict = CreateMeasurementDictionary(timeRangeData, timeRange);

            const tideData = measurementDict["tide"]?.reverse() || [];
            const waveData = measurementDict["waveHeight"]?.reverse() || [];
            const tempData = measurementDict["waterTemperature"]?.reverse() || [];
            setChartTide(tideData);
            setChartWaveHeight(waveData);
            setChartWaterTemperature(tempData);
        }
    }, [timeRangeData, timeRange])

    const filteredMeasurements = useMemo(() => {
        if (!timeRangeData?.boxes) return [];
        const latestMeasurements = GetLatestMeasurements(timeRangeData.boxes);
        const filtered = latestMeasurements.filter(
            m => !excludedMeasurements.includes(m.measurementType)
        );

        const order = ["Temperature, water", "Tide", "Wave Height"];
        return filtered.sort((a, b) => {
            const indexA = order.indexOf(a.measurementType);
            const indexB = order.indexOf(b.measurementType);

            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;

            return indexA - indexB;
        });
    }, [timeRangeData, excludedMeasurements]);

    const currentWaterTemp = useMemo(() => {
        const measurement = filteredMeasurements.find(m =>
            m.measurementType === "Temperature, water" ||
            m.measurementType === "WTemp"
        );
        return measurement?.value;
    }, [filteredMeasurements]);

    const currentWaveHeight = useMemo(() => {
        const measurement = filteredMeasurements.find(m =>
            m.measurementType === "Wave Height"
        );
        return measurement?.value;
    }, [filteredMeasurements]);

    const currentWaterLevel = useMemo(() => {
        const measurement = filteredMeasurements.find(m =>
            m.measurementType === "Tide"
        );
        return measurement?.value;
    }, [filteredMeasurements]);

    const infoItemWidth = media.md ? '48%' : '100%';

    const renderHarborInfoContent = useCallback((extraProps?: Partial<ComponentProps<typeof Card.Footer>>) => (
        <Card.Footer
            padded
            backgroundColor="$gray1"
            borderTopWidth={1}
            borderTopColor="$borderColor"
            {...extraProps}
        >
            <XStack flexWrap="wrap" gap="$4" width="100%">
                <XStack
                    gap="$2"
                    alignItems="center"
                    flexGrow={1}
                    flexShrink={1}
                    style={{flexBasis: infoItemWidth, minWidth: 0}}
                >
                    <MapPin size={18} color="$gray10"/>
                    <YStack>
                        <Text fontSize="$1" color="$gray11">{t('dashboard.address')}</Text>
                        <Text fontSize="$3">{t('dashboard.addressValue')}</Text>
                    </YStack>
                </XStack>
                <XStack
                    gap="$2"
                    alignItems="center"
                    flexGrow={1}
                    flexShrink={1}
                    style={{flexBasis: infoItemWidth, minWidth: 0}}
                >
                    <Clock size={18} color="$gray10"/>
                    <YStack>
                        <Text fontSize="$1" color="$gray11">{t('dashboard.openingHours')}</Text>
                        <Text fontSize="$3">{t('dashboard.openingHoursValue')}</Text>
                    </YStack>
                </XStack>
            </XStack>
        </Card.Footer>
    ), [infoItemWidth, t]);

    const handleInfoLayout = useCallback((event: LayoutChangeEvent) => {
        const {height} = event.nativeEvent.layout;
        if (height <= 0 || height === infoContentHeight) {
            return;
        }

        setInfoContentHeight(height);

        if (showInfo) {
            Animated.timing(infoHeight, {
                toValue: height,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    }, [infoContentHeight, infoHeight, showInfo]);

    const toggleInfo = () => {
        const nextShow = !showInfo;
        setShowInfo(nextShow);
        Animated.timing(infoHeight, {
            toValue: nextShow ? infoContentHeight : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const latestTime = timeRangeData?.boxes[0]?.measurementTimes[0]?.time || new Date().toISOString();

    return (
        <SafeAreaView style={{flex: 1}}>
            <YStack flex={1} backgroundColor="$content1">
            <ScrollView style={{flex: 1}}>
                <Stack position="relative" width="100%" height={media.lg ? 350 : 250} overflow="hidden">
                    <Image
                        source={{
                            uri: "https://www.im-jaich.de/wp-content/uploads/2022/07/im-jaich-Flensburg-2019-0196-Kristina-Steiner.jpg",
                        }}
                        width="100%"
                        height="100%"
                    />

                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.6)']}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '60%',
                        }}
                    />

                    <Stack position="absolute" bottom="$4" left="$4" right="$4">
                        <Text color="white" fontSize="$3" opacity={0.9} marginBottom="$1">
                            {t('dashboard.title')}
                        </Text>
                        <H1
                            color="white"
                            fontSize={media.lg ? "$10" : "$8"}
                            fontWeight="700"
                            textShadowColor="rgba(0,0,0,0.2)"
                            textShadowOffset={{width: 0, height: 1}}
                            textShadowRadius={2}
                        >
                            {name || t('dashboard.loading')}
                        </H1>
                        <View style={{width: 300}}>
                            <NavigateDashboardDropdownMenu
                                isDark={isDark}
                                router={router}
                                sensorLocations={sensorLocations}
                                selectedMarinaId={Number(id)}
                            />
                        </View>
                    </Stack>
                </Stack>

                <YStack
                    padding={media.md ? "$3" : "$4"}
                    gap={media.md ? "$4" : "$5"}
                    maxWidth={1800}
                    width="100%"
                    alignSelf="center"
                    marginTop={media.md ? -20 : -30}
                >

                    <Card
                        bordered
                        padding={2}
                        animation="quick"
                        backgroundColor={'$content2'}
                        borderWidth={1}
                        borderColor="$borderColor"
                    >
                        <Card.Header padded>
                            <XStack justifyContent="space-between" alignItems="center">
                                <XStack gap="$3" alignItems="center" flex={1}>
                                    <Stack
                                        width={44}
                                        height={44}
                                        borderRadius="$3"
                                        backgroundColor={isDark ? '$gray8' : '$gray3'}
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Home size={24} color="$gray10"/>
                                    </Stack>
                                    <YStack flex={1}>
                                        <Text color="$gray11" fontSize="$2">{t('dashboard.harbor')}</Text>
                                        <H3 fontSize="$6" fontWeight="600">{name}</H3>
                                    </YStack>
                                </XStack>
                                <Button
                                    size="$3"
                                    variant="outlined"
                                    icon={showInfo ? ChevronUp : ChevronDown}
                                    onPress={toggleInfo}
                                    circular
                                />
                            </XStack>
                        </Card.Header>

                        <View
                            style={{
                                position: 'absolute',
                                opacity: 0,
                                pointerEvents: 'none',
                                width: '100%',
                                top: 0,
                                left: 0,
                                right: 0,
                            }}
                            onLayout={handleInfoLayout}
                        >
                            {renderHarborInfoContent()}
                        </View>

                        <Animated.View
                            style={{
                                overflow: "hidden",
                                height: infoHeight,
                            }}
                        >
                            {renderHarborInfoContent({
                                pointerEvents: showInfo ? 'auto' : 'none',
                                style: {opacity: showInfo ? 1 : 0},
                            })}
                        </Animated.View>
                    </Card>

                    <YStack gap="$3">
                        <XStack alignItems="center" justifyContent="space-between">
                            <H3 fontSize="$5" fontWeight="600">{t('dashboard.currentMeasurements')}</H3>
                            <XStack gap="$1" alignItems="center">
                                <Stack width={6} height={6} borderRadius="$5" backgroundColor="$green9"/>
                                <Text fontSize="$2" color="$gray11">
                                    {(timeRange === 'today' || timeRange === 'yesterday') ? t('dashboard.live') : t('last.measurement')} {formatTimeToLocal(latestTime)}
                                </Text>
                            </XStack>
                        </XStack>
                        <XStack
                            gap="$3"
                            width="100%"
                            flexWrap={media.md ? "wrap" : "nowrap"}
                            justifyContent={media.md ? "center" : "space-between"}
                        >
                            {filteredMeasurements
                                .slice(0, 3)
                                .map((measurement, index) => (
                                    <Card
                                        key={index}
                                        bordered
                                        backgroundColor={'$content2'}
                                        flex={media.md ? undefined : 1}
                                        width={media.md ? "100%" : undefined}
                                        minWidth={250}
                                        borderWidth={1}
                                        borderColor="$borderColor"
                                    >
                                        <Card.Header padded>
                                            <YStack gap="$3" alignItems="center">
                                                <Stack
                                                    width={56}
                                                    height={56}
                                                    borderRadius="$4"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    {getMeasurementIcon(measurement.measurementType, 32)}
                                                </Stack>
                                                <YStack alignItems="center" gap="$2">
                                                    <Text
                                                        color="$gray11"
                                                        fontSize="$4"
                                                        fontWeight="600"
                                                        textAlign="center"
                                                    >
                                                        {getTextFromMeasurementType(measurement.measurementType, t)}
                                                    </Text>
                                                    <XStack alignItems="baseline" gap="$2">
                                                        <H2 fontSize="$10" fontWeight="700"
                                                            color={getMeasurementColor(measurement.measurementType)}>
                                                            {formatMeasurementValue(measurement.value)}
                                                        </H2>
                                                        <Text fontSize="$6"
                                                              color={getMeasurementColor(measurement.measurementType)}
                                                              fontWeight="600">
                                                            {getMeasurementTypeSymbol(measurement.measurementType, t)}
                                                        </Text>
                                                    </XStack>
                                                </YStack>
                                            </YStack>
                                        </Card.Header>
                                    </Card>
                                ))}
                        </XStack>
                    </YStack>


                    {filteredMeasurements.length > 3 && (
                        <YStack gap="$3">
                            <H2 fontSize="$6">{t('dashboard.furtherMeasurements')}</H2>
                            <XStack
                                flexWrap="wrap"
                                gap="$3"
                                justifyContent={media.lg ? 'flex-start' : 'center'}
                            >
                                {filteredMeasurements
                                    .slice(3)
                                    .map((a, index) => (
                                        <MeasurementCard
                                            key={index}
                                            measurementType={a.measurementType}
                                            value={formatMeasurementValue(a.value)}
                                        />
                                    ))}
                            </XStack>
                        </YStack>
                    )}

                    <Separator marginVertical="$2"/>

                    <YStack gap="$4">
                        <XStack alignItems="center" justifyContent="space-between" flexWrap="wrap" gap="$2">
                            <YStack gap="$1">
                                <H3 fontSize="$5" fontWeight="600">{t('dashboard.historicalData')}</H3>
                                <Text fontSize="$2" color="$gray11">
                                    {timeRange === 'today' ? t('dashboard.timeRange.today') :
                                        timeRange === 'yesterday' ? t('dashboard.timeRange.yesterday') :
                                            timeRange === 'last7days' ? t('dashboard.timeRange.last7days') :
                                                timeRange === 'last30days' ? t('dashboard.timeRange.last30days') :
                                                    timeRange === 'last90days' ? t('dashboard.timeRange.last90days') :
                                                        timeRange === 'last180days' ? t('dashboard.timeRange.last180days') :
                                                            t('dashboard.timeRange.last1year')}
                                </Text>
                            </YStack>
                            <TimeRangeDropdown
                                selectedTimeRange={timeRange}
                                setTimeRange={setTimeRange}
                                isDark={isDark}
                            />
                        </XStack>

                        <YStack
                            gap="$3"
                            width="100%"
                        >
                            <LineChartCard
                                title={t('dashboard.charts.waterTemperature')}
                                icon={<Thermometer size={20} color="#F97316"/>}
                                chartData={chartWaterTemperature}
                                color="#F97316"
                                currentValue={currentWaterTemp}
                            />
                            <LineChartCard
                                title={t('dashboard.charts.waterLevel')}
                                icon={<Activity size={20} color="#3B82F6"/>}
                                chartData={chartTide}
                                color="#3B82F6"
                                currentValue={currentWaterLevel}
                            />
                            <LineChartCard
                                title={t('dashboard.charts.waveHeight')}
                                icon={<Waves size={20} color="#10B981"/>}
                                chartData={chartWaveHeight}
                                color="#10B981"
                                currentValue={currentWaveHeight}
                            />
                        </YStack>
                    </YStack>
                </YStack>
            </ScrollView>
            </YStack>
        </SafeAreaView>
    );
}
