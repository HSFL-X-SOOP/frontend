import {DetailedLocationDTO} from '@/api/models/location';
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
import {useLocationStore} from '@/api/stores/location.service';
import {
    CreateMeasurementDictionary,
    GetLatestMeasurements,
    formatMeasurementValue,
    getIDFromMeasurementType,
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
    Heart,
    Home,
    MapPin,
    Thermometer,
    Waves, 
    HeartPlus, 
    HeartMinus,
    BellOff,
    Bell, 
    BrickWallFire,
    MessageSquarePlus
} from '@tamagui/lucide-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {useEffect, useMemo, useCallback, useRef, useState, use} from 'react';
import type {ComponentProps} from 'react';
import {Animated, LayoutChangeEvent, SafeAreaView, ScrollView, View} from 'react-native';
import {
    Adapt,
    Button,
    Card,
    Checkbox,
    Dialog,
    FontSizeTokens,
    H1,
    H2,
    H3,
    Image,
    Input,
    Label,
    PopoverProps,
    Select,
    Separator,
    Sheet,
    Stack,
    Text,
    TextArea,
    XStack,
    YStack,
    getFontSize,
    useMedia
} from 'tamagui';

import { useUserLocations } from '@/hooks/useUserLocations';
import { UserLocation } from '@/api/models/userLocation';
import { useNotificationMeasurementRules } from '@/hooks/useNotificationMeasurementRules';
import { MeasurementType, NotificationMeasurementRule } from '@/api/models/notificationMeasurementRule';
import { Popover } from 'tamagui';
import { useNotificationLocations } from '@/hooks/useNotificationLocations';
import { useSession } from '@/context/SessionContext';
import { AuthorityRole } from '@/api/models/profile';
import { useNotificationMeasurementRuleStore } from '@/api/stores/notificationMeasurementRule';
// ============================================================================
// Helper Functions
// ============================================================================

const GetMarinaID = (name: string, locations: LocationWithBoxes[]): number | null => {
    for (const locationData of locations) {
        if (locationData.location?.name === name && locationData.location?.id) {
            return locationData.location.id;
        }
    }
    return null;
}

// ============================================================================
// Main Component
// ============================================================================

export default function DashboardScreen() {
    // ----------------------------------------------------------------------------
    // Hooks - Context & Router
    // ----------------------------------------------------------------------------
    const media = useMedia();
    const router = useRouter();
    const {t} = useTranslation();
    const {isDark} = useThemeContext();
    let {name} = useLocalSearchParams();
    const userLocations = useUserLocations();
    const session = useSession();
    const userID = session?.session?.profile?.id ?? -1;
    const isHarborMaster = session?.session?.role === AuthorityRole.USER;

    if (!name) {
        name = 'Stadthafen Flensburg "Im Jaich"';
    }

    // ----------------------------------------------------------------------------
    // State
    // ----------------------------------------------------------------------------
    const [marinaID, setMarinaID] = useState<number | null>(null);
    const [timeRange, setTimeRange] = useState<ChartTimeRange>('today');
    const [showInfo, setShowInfo] = useState(false);
    const [infoContentHeight, setInfoContentHeight] = useState(0);
    const [chartWaterTemperature, setChartWaterTemperature] = useState<ChartDataPoint[]>([]);
    const [chartTide, setChartTide] = useState<ChartDataPoint[]>([]);
    const [chartWaveHeight, setChartWaveHeight] = useState<ChartDataPoint[]>([]);
    const [userLocation, setUserLocation] = useState<UserLocation | undefined>(undefined);

    // ----------------------------------------------------------------------------
    // Refs
    // ----------------------------------------------------------------------------
    const infoHeight = useRef(new Animated.Value(0)).current;

    // ----------------------------------------------------------------------------
    // API Data Fetching
    // ----------------------------------------------------------------------------
    const {data: allSensorData} = useSensorDataNew();
    const locationStore = useLocationStore();
    const [detailedLocation, setDetailedLocation] = useState<DetailedLocationDTO | null>(null);

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

    const {data: timeRangeData} = useSensorDataTimeRange(Number(marinaID), apiTimeRange);

    // ----------------------------------------------------------------------------
    // Computed Values - Sensor Locations & Marina
    // ----------------------------------------------------------------------------
    const sensorLocations = useMemo(() => {
        return allSensorData
            .filter(data => data.location?.id != null)
            .map(data => ({
                id: data.location!.id,
                name: data.location!.name || ''
            }));
    }, [allSensorData]);

    const harbourName = useMemo(() => {
        return detailedLocation?.name || "";
    }, [detailedLocation]);

    // Get location image URL
    const locationImageUrl = useMemo(() => {
        if (!marinaID) return "https://fastly.picsum.photos/id/17/2500/1667.jpg?hmac=HD-JrnNUZjFiP2UZQvWcKrgLoC_pc_ouUSWv8kHsJJY";
        return `https://test.marlin-live.com/api/location/${marinaID}/image`;
    }, [marinaID]);

    // ----------------------------------------------------------------------------
    // Computed Values - Measurements
    // ----------------------------------------------------------------------------
    const excludedMeasurements = useMemo(() => {
        return ["Standard deviation", "Battery, voltage"];
    }, []);

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

    // ----------------------------------------------------------------------------
    // Effects
    // ----------------------------------------------------------------------------
    useEffect(() => {
        const id = GetMarinaID(name as string, allSensorData);
        setMarinaID(id);
    }, [name, allSensorData, marinaID]);

    useEffect(() => {
        if (!marinaID) return;

        const fetchDetailedLocation = async () => {
            const result = await locationStore.getLocationById(marinaID);
            setDetailedLocation(result);
        };

        void fetchDetailedLocation();
    }, [marinaID, detailedLocation]);

    useEffect(() => {
        if (!marinaID) return;

        const fetchUserLocation = async () => {
            try {
                const userLocation = await userLocations.getUserLocationByUserIdAndLocationId(userID, marinaID);
                setUserLocation(userLocation);
            } catch (e) {
                console.warn('fetchUserLocation failed', e);
                setUserLocation(undefined);
            }
        };

        void fetchUserLocation();
    }, [marinaID]);

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
    }, [timeRangeData, timeRange]);

    // ----------------------------------------------------------------------------
    // UI Computed Values
    // ----------------------------------------------------------------------------
    const infoItemWidth = media.md ? '48%' : '100%';
    const latestTime = timeRangeData?.boxes[0]?.measurementTimes[0]?.time || new Date().toISOString();

    // ----------------------------------------------------------------------------
    // Callbacks
    // ----------------------------------------------------------------------------
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
                        <Text fontSize="$3">{detailedLocation?.address || t('dashboard.addressValue')}</Text>
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
                        <Text fontSize="$3">{detailedLocation?.openingHours || t('dashboard.openingHoursValue')}</Text>
                    </YStack>
                </XStack>
            </XStack>
        </Card.Footer>
    ), [infoItemWidth, t, detailedLocation]);

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

    const toggleInfo = useCallback(() => {
        const nextShow = !showInfo;
        setShowInfo(nextShow);
        Animated.timing(infoHeight, {
            toValue: nextShow ? infoContentHeight : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [showInfo, infoHeight, infoContentHeight]);

    const createOrDeleteUserLocation = useCallback(async () => {
        if (!marinaID) return;

        if (userLocation && userLocation.id) {
            await userLocations.deleteUserLocation(userLocation.id);
            setUserLocation(undefined);
        } else {
            const createdUserLocation = await userLocations.create({
                userId: userID,
                locationId: marinaID,
                sentHarborNotifications: false,
            });
            setUserLocation(createdUserLocation);
        }

    }, [userLocation, userLocations, marinaID]);

    const updateUserLocationSentHarborNotifications = useCallback(async () => {
        if (!marinaID || !userLocation) return;
        
        const updatedUserocation = await userLocations.update(userLocation.id, {
            userId: userID,
            locationId: marinaID,
            sentHarborNotifications: !userLocation.sentHarborNotifications,
        });
        setUserLocation(updatedUserocation);
    }, [userLocation, userLocations, marinaID, userID]);

    // ----------------------------------------------------------------------------
    // Render
    // ----------------------------------------------------------------------------
    return (
        <SafeAreaView style={{flex: 1}}>
            <YStack flex={1} backgroundColor="$content1">
                <ScrollView style={{flex: 1}}>
                    {/* Header Image with Gradient */}
                    <Stack position="relative" width="100%" height={media.lg ? 350 : 250} overflow="hidden">
                        <Image
                            source={{uri: locationImageUrl}}
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
                                {harbourName || t('dashboard.loading')}
                            </H1>
                            <View style={{width: 300}}>
                                <XStack gap={20}>
                                <NavigateDashboardDropdownMenu
                                    isDark={isDark}
                                    router={router}
                                    sensorLocations={sensorLocations}
                                    selectedMarina={harbourName}
                                />
                               
                                {(userID > -1) && (

                                   <XStack>

                                    <Button
                                    size="$5"
                                    variant="outlined"
                                    icon={userLocation ? HeartMinus : HeartPlus}
                                    onPress={createOrDeleteUserLocation}
                                    circular
                                    visibility='hidden'
                                    />
                                    {userLocation &&(
                                        <Button
                                        size="$5"
                                        variant="outlined"
                                        icon={userLocation?.sentHarborNotifications ? BellOff : Bell}
                                        onPress={updateUserLocationSentHarborNotifications}
                                        circular
                                        />
                                    )}
                                    {true && (
                                        <HarborMasterBroadcastNotificationPopover
                                        shouldAdapt={false}
                                        placement="top"
                                        Icon={MessageSquarePlus}
                                        Name={"Harbor Master Notification"}
                                        userID={userID}
                                        marinaID={marinaID}
                                        />)}
                                    </XStack>
                                )}
                                </XStack>
                            </View>
                        </Stack>
                    </Stack>

                    {/* Main Content */}
                    <YStack
                        padding={media.md ? "$3" : "$4"}
                        gap={media.md ? "$4" : "$5"}
                        maxWidth={1800}
                        width="100%"
                        alignSelf="center"
                        marginTop={media.md ? -20 : -30}
                    >
                        {/* Harbor Info Card */}
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
                                            <H3 fontSize="$6" fontWeight="600">{harbourName}</H3>
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

                            {/* Hidden Info Layout Measurer */}
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

                            {/* Animated Info Content */}
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

                        {/* Current Measurements Section */}
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
                                                {userLocation &&(
                                                    <SetNotificationMeasurementRulePopover
                                                    shouldAdapt={false}
                                                    placement="top"
                                                    Icon={Bell}
                                                    Name={getTextFromMeasurementType(measurement.measurementType, t)}
                                                    Value={measurement.value}
                                                    MeasurementType={measurement.measurementType}
                                                    marinaID={marinaID}
                                                    userID={userID}
                                                    measurement={measurement}
                                                    t={t}
                                                />)}
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

                        {/* Further Measurements Section */}
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

                        {/* Historical Data Section */}
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

                            {/* Charts */}
                            <YStack gap="$3" width="100%">
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

export function SetNotificationMeasurementRulePopover({
  Icon,
  Name,
  shouldAdapt,
  userID,
  marinaID,
  Value,
  MeasurementType,
  measurement,
  t,
  ...props
}: PopoverProps & { Icon?: any; Name?: string; shouldAdapt?: boolean; userID?: number | null; marinaID?: number | null; Value?: number; MeasurementType: string, measurement: any, t: any}) {
    const notificationMeasurementRules = useNotificationMeasurementRules();
    const [measurementValue, setMeasurementValue] = useState<number>(Value || 0);
    const [operator, setOperator] = useState<string>('>');
    const [isActive, setIsActive] = useState<boolean>(true);
    const [open, setOpen] = useState(false)
    const [existingRule, setExistingRule] = useState<NotificationMeasurementRule | null | undefined>(undefined);
    const TEMPERATURE_MIN_VALUE = -10;
    const TEMPERATURE_MAX_VALUE = 50;
    useEffect(() => {
        if (!marinaID || !userID) return;
        const fetchNotificationMeasurementRule = async () => {
            try {
                const fetchedRule = await notificationMeasurementRules.getNotificationMeasurementRule(userID, marinaID, getIDFromMeasurementType(MeasurementType));
                setExistingRule(fetchedRule);
                setMeasurementValue(fetchedRule?.measurementValue || 0);
                setOperator(fetchedRule?.operator || '>');
                setIsActive(fetchedRule?.isActive ?? true);
                console.log('Fetched existing rule:', fetchedRule);
            } catch (e) {
                console.warn('fetchUserLocation failed', e);
                setExistingRule(null);
            }
        };

        void fetchNotificationMeasurementRule();
    }, [marinaID, userID, MeasurementType]);
    
    const createNotificationMeasurementRule = useCallback(async (value: number) => {
        if (!marinaID) return;
        const notificationMeasurementRule = {
            userId: userID || -1,
            locationId: marinaID,
            measurementTypeId: getIDFromMeasurementType(MeasurementType),
            operator: operator,
            measurementValue: value,
            isActive: isActive,
        }
        
        if (existingRule) {
            await notificationMeasurementRules.update(existingRule.id, notificationMeasurementRule);
        } else {
            await notificationMeasurementRules.create(notificationMeasurementRule);
        }

    }, [marinaID, operator, isActive, userID, MeasurementType, existingRule]);
    return (
        <Dialog
        allowFlip
        stayInFrame
        offset={15}
        {...props}
        open={open}
        onOpenChange={setOpen}
        >
            <Dialog.Trigger asChild>
                <Button icon={Icon} onPress={() => setOpen(true)} />
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay 
                onPress={() => setOpen(false)} 
                backgroundColor="rgba(0,0,0,0.3)" 
                />

                <Dialog.Content
                key={`${measurement.id}-${measurement.measurementType}`}
                borderWidth={1}
                borderColor="$borderColor"
                elevate
                p="$4"
                maxWidth="90%"
                width="100%"
                borderRadius="$6"
                animation={[
                    'quick',
                    {
                    opacity: { overshootClamping: true },
                    },
                ]}
                enterStyle={{ opacity: 0, scale: 0.95 }}
                exitStyle={{ opacity: 0, scale: 0.95 }}
                >

                <YStack gap="$4">
                    
                    <Text
                    fontSize="$6"
                    fontWeight="700"
                    textAlign="center"
                    >
                    Benachrichtige mich, wenn …
                    </Text>

                    {/* Measurement Display */}
                    <YStack gap="$2" alignItems="center">
                        <Text fontSize="$4" color="$gray11" fontWeight="600">
                            {getTextFromMeasurementType(measurement.measurementType, t)}
                        </Text>

                        <XStack alignItems="baseline" gap="$2">
                            <H2 fontSize="$9" color={getMeasurementColor(measurement.measurementType)}>
                            {formatMeasurementValue(measurement.value)}
                            </H2>
                            <Text fontSize="$5" color={getMeasurementColor(measurement.measurementType)}>
                            {getMeasurementTypeSymbol(measurement.measurementType, t)}
                            </Text>
                        </XStack>
                    </YStack>

                    {/* Operator Value Selector */}
                    <XStack gap="$2" justifyContent="center">
                    <Button
                        size="$3"
                        theme={operator === "<" ? "active" : "gray"}
                        onPress={() => setOperator("<")}
                    >
                        {"kleiner als Zielwert"}
                    </Button>

                    <Button
                        size="$3"
                        theme={operator === ">" ? "active" : "gray"}
                        onPress={() => setOperator(">")}
                    >
                        {"größer als Zielwert"}
                    </Button>
                    </XStack>

                    {/* Measurement Value Input */}
                    <YStack gap="$2" alignItems="center">
                    <Text fontSize="$4" fontWeight="600" color="$gray11">
                        Zielwert
                    </Text>

                    <XStack gap="$2" alignItems="center">
                        <Input
                        size="$3"
                        width={90}
                        keyboardType="decimal-pad"
                        inputMode="decimal"
                        value={measurementValue.toString()}
                        onChangeText={(text) => {
                            if (/^-?\d*\.?\d*$/.test(text)) {
                                let value = text === "" ? 0 : parseFloat(text);

                                if (value < TEMPERATURE_MIN_VALUE) value = TEMPERATURE_MIN_VALUE;
                                if (value > TEMPERATURE_MAX_VALUE) value = TEMPERATURE_MAX_VALUE;

                                setMeasurementValue(value);
                            }
                        }}
                        />
                        <Text fontSize="$5" fontWeight="600" color={getMeasurementColor(measurement.measurementType)}>
                        {getMeasurementTypeSymbol(measurement.measurementType, t)}
                        </Text>
                    </XStack>
                    </YStack>

                    {/* Checkbox */}
                    <YStack gap="$2" alignItems="center">
                        <XStack alignItems="center" gap="$2">
                            <Checkbox
                            checked={isActive}
                            onCheckedChange={(checked: boolean | "indeterminate") => {
                                setIsActive(checked === true);
                            }}
                            size="$4"
                            borderColor="$gray7"
                            >
                                <Checkbox.Indicator>
                                    <Text fontSize="$4">✓</Text>
                                </Checkbox.Indicator>
                            </Checkbox>
                            <Text fontSize="$4" fontWeight="600" color="$gray11">
                                Aktiv
                            </Text>
                        </XStack>
                    </YStack>

                    <Dialog.Close asChild>
                        <Button
                            size="$4"
                            width="100%"
                            onPress={() => {
                            if (!marinaID) return;
                            createNotificationMeasurementRule(measurementValue);
                            }}
                        >
                            Speichern
                        </Button>
                    </Dialog.Close>
                
                </YStack>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
  )
}

export function HarborMasterBroadcastNotificationPopover({
  Icon,
  Name,
  shouldAdapt,
  userID,
  marinaID,
  ...props
}: PopoverProps & { Icon?: any; Name?: string; shouldAdapt?: boolean; userID?: number | null; marinaID?: number | null}) {
    const [notificationTitle, setNotificationTitle] = useState<string>('');
    const [notificationMessage, setNotificationMessage] = useState<string>('');
    const notificationLocations = useNotificationLocations();

    const createNotificationLocation = useCallback(async () => {
        if (!marinaID) return;

        const notificationLocation = {
            locationId: marinaID,
            notificationTitle: notificationTitle,
            notificationText: notificationMessage,
            createdBy: userID || -1,
        }
        await notificationLocations.create(notificationLocation);
    }, [marinaID, notificationTitle, notificationMessage, userID]);

    return (
    <Popover size="$5" allowFlip stayInFrame offset={15} resize {...props}>
      <Popover.Trigger asChild>
        <Button 
            size="$5"
            variant="outlined"
            icon={Icon} 
            circular
            />
      </Popover.Trigger>

      {shouldAdapt && (
        <Adapt platform="touch">
          <Sheet animation="medium" modal dismissOnSnapToBottom>
            <Sheet.Frame padding="$4">
              <Adapt.Contents />
            </Sheet.Frame>
            <Sheet.Overlay
              backgroundColor="$shadowColor"
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>
      )}

      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        width={300}
        height={275}
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
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

        <YStack gap="$3">
            <XStack>
                <Text fontSize="$6" fontWeight="600">{Name}</Text>
            </XStack>
            <XStack gap="$3">
                <Label size="$3" htmlFor={"Title"}>
                {"Title"}
                </Label>
                <Input f={1} size="$3" id={"Title"} onChangeText={(text) => setNotificationTitle(text)} />
                
            </XStack>

            <XStack gap="$3">
                <Label size="$3" htmlFor={"Message"}>
                {"Message"}
                </Label>
                <TextArea f={1} size="$3" id={"Message"} onChangeText={(text) => setNotificationMessage(text)} />
            </XStack>


          <Popover.Close asChild>
            <Button
              size="$3"
              onPress={() => {
                if (!marinaID) {
                  return;
                }
                createNotificationLocation();
              }}
            >
              An alle Subscriber senden
            </Button>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}
