import {DetailedLocationDTO} from '@/api/models/location';
import {LocationWithBoxes} from '@/api/models/sensor';
import {
    LineChartCard,
    MeasurementCard,
    NavigateDashboardDropdownMenu,
    NotificationRuleDialog,
    BroadcastNotificationPopover,
    ChartTimeRange,
    TimeRangeDropdown
} from '@/components/dashboard';
import {useThemeContext} from '@/context/ThemeSwitch';
import {useLocations, useSensorDataNew, useSensorDataTimeRange, useUserLocations} from '@/hooks/data';
import {useTranslation, useToast} from '@/hooks/ui';
import {ChartDataPoint} from '@/types/chart';
import {ENV} from '@/config/environment';
import type {AppError} from '@/utils/errors';
import {
    createMeasurementDictionary,
    formatMeasurementValue,
    getMeasurementColor,
    getMeasurementIcon,
    getMeasurementTypeSymbol,
    getTextFromMeasurementType
} from '@/utils/measurements';
import {mapTimeRangeToApi, getFilteredMeasurements, getCurrentValues} from '@/utils/sensorMeasurements';
import {formatTimeToLocal} from '@/utils/time';
import {
    Activity,
    ChevronDown,
    ChevronUp,
    Clock,
    Home,
    MapPin,
    Thermometer,
    Waves,
    HeartPlus,
    HeartMinus,
    BellOff,
    Bell,
    MessageSquarePlus
} from '@tamagui/lucide-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {useEffect, useMemo, useCallback, useRef, useState} from 'react';
import type {ComponentProps} from 'react';
import {Animated, LayoutChangeEvent, ScrollView} from 'react-native';
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
    useMedia,
    View
} from 'tamagui';

import {UserLocation} from '@/api/models/userLocation';
import {useSession} from '@/context/SessionContext';
import {IconButton} from '@/types/button';


// ============================================================================
// Main Component
// ============================================================================

export default function DashboardScreen() {
    const DEFAULT_MARINA_NAME = 'Stadthafen Flensburg "Im Jaich"';
    const DEFAULT_IMAGE_URL = "https://fastly.picsum.photos/id/17/2500/1667.jpg?hmac=HD-JrnNUZjFiP2UZQvWcKrgLoC_pc_ouUSWv8kHsJJY";

    const getMarinaIdByName = (name: string, locations: LocationWithBoxes[]): number | null => {
        const location = locations.find(loc => loc.location?.name === name);
        return location?.location?.id ?? null;
    };

    const getTimeRangeLabel = (timeRange: ChartTimeRange, t: any): string => {
        const labels: Record<ChartTimeRange, string> = {
            'today': t('dashboard.timeRange.today'),
            'yesterday': t('dashboard.timeRange.yesterday'),
            'last7days': t('dashboard.timeRange.last7days'),
            'last30days': t('dashboard.timeRange.last30days'),
            'last90days': t('dashboard.timeRange.last90days'),
            'last180days': t('dashboard.timeRange.last180days'),
            'last1year': t('dashboard.timeRange.last1year')
        };
        return labels[timeRange] ?? '';
    };


    // Hooks
    const media = useMedia();
    const router = useRouter();
    const {t} = useTranslation();
    const toast = useToast();
    const {isDark} = useThemeContext();
    const {session} = useSession();
    const {getUserLocationByUserIdAndLocationId, deleteUserLocation, update, create} = useUserLocations();
    const {fetchData: fetchSensors} = useSensorDataNew();
    const {fetchLocationById} = useLocations()
    const [allSensorData, setAllSensorData] = useState<LocationWithBoxes[]>([]);

    // Route params
    let {name} = useLocalSearchParams();
    if (!name) name = DEFAULT_MARINA_NAME;

    // User info
    const userID = session?.profile?.id ?? null;
    const isLoggedIn = userID != null;

    // State
    const [marinaID, setMarinaID] = useState<number | null>(null);
    const [timeRange, setTimeRange] = useState<ChartTimeRange>('today');
    const [showInfo, setShowInfo] = useState(false);
    const [infoContentHeight, setInfoContentHeight] = useState(0);
    const [chartData, setChartData] = useState<{
        waterTemperature: ChartDataPoint[];
        tide: ChartDataPoint[];
        waveHeight: ChartDataPoint[];
    }>({waterTemperature: [], tide: [], waveHeight: []});
    const [userLocation, setUserLocation] = useState<UserLocation | undefined>(undefined);
    const [detailedLocation, setDetailedLocation] = useState<DetailedLocationDTO | null>(null);
    const [timeRangeData, setTimeRangeData] = useState<LocationWithBoxes | null>(null);

    // Refs
    const infoHeight = useRef(new Animated.Value(0)).current;

    // API Data
    const apiTimeRange = useMemo(() => mapTimeRangeToApi(timeRange), [timeRange]);
    const {fetchData: fetchTimeRangeData} = useSensorDataTimeRange(marinaID, apiTimeRange);

    // Computed Values
    const sensorLocations = useMemo(() => {
        return allSensorData
            .filter(data => data.location?.id != null)
            .map(data => ({
                id: data.location!.id,
                name: data.location!.name || ''
            }));
    }, [allSensorData]);

    const harbourName = detailedLocation?.name || "";
    const [locationImageUrl, setLocationImageUrl] = useState<string>(DEFAULT_IMAGE_URL);

    const filteredMeasurements = useMemo(() => getFilteredMeasurements(timeRangeData), [timeRangeData]);

    const currentValues = useMemo(() => getCurrentValues(filteredMeasurements), [filteredMeasurements]);

    const latestTime = timeRangeData?.boxes[0]?.measurementTimes[0]?.time || new Date().toISOString();
    const infoItemWidth = media.md ? '48%' : '100%';

    // Effects
    useEffect(() => {
        void fetchSensors(
            (data: LocationWithBoxes[]) => setAllSensorData(data),
            (error: AppError) => {
                toast.error(t('common.error'), {message: t(error.onGetMessage())});
                setAllSensorData([]);
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // fetchSensors comes from a hook and is unstable; toast/t are static utilities

    useEffect(() => {
        const id = getMarinaIdByName(name as string, allSensorData);
        setMarinaID(id);
    }, [name, allSensorData]);

    useEffect(() => {
        if (!marinaID) return;
        void fetchLocationById(
            marinaID,
            (data: DetailedLocationDTO) => setDetailedLocation(data),
            (error: AppError) => {
                setDetailedLocation(null);
                toast.error(t('common.error'), {message: t(error.onGetMessage())});
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marinaID]); // fetchLocationById comes from a hook and is unstable; toast/t are static utilities

    useEffect(() => {
        if (!marinaID) {
            setLocationImageUrl(DEFAULT_IMAGE_URL);
            return;
        }
        setLocationImageUrl(`${ENV.apiUrl}/location/${marinaID}/image`);
    }, [marinaID]);

    useEffect(() => {
        if (!marinaID) {
            setTimeRangeData(null);
            return;
        }
        void fetchTimeRangeData(
            (data: LocationWithBoxes) => setTimeRangeData(data),
            (error: AppError) => {
                toast.error(t('common.error'), {message: t(error.onGetMessage())});
                setTimeRangeData(null);
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marinaID, apiTimeRange]); // fetchTimeRangeData comes from a hook and is unstable; toast/t are static utilities

    useEffect(() => {
        if (!marinaID || !isLoggedIn) return;
        const fetchUserLocation = async () => {
            await getUserLocationByUserIdAndLocationId(
                userID,
                marinaID,
                (location) => {
                    setUserLocation(location);
                },
                () => {
                    setUserLocation(undefined);
                }
            );
        };
        void fetchUserLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marinaID]); // getUserLocationByUserIdAndLocationId is a hook function

    useEffect(() => {
        if (!timeRangeData) return;
        const measurementDict = createMeasurementDictionary(timeRangeData, timeRange);
        setChartData({
            waterTemperature: measurementDict["waterTemperature"]?.reverse() || [],
            tide: measurementDict["tide"]?.reverse() || [],
            waveHeight: measurementDict["waveHeight"]?.reverse() || []
        });
    }, [timeRangeData, timeRange]);

    // Callbacks
    const toggleInfo = useCallback(() => {
        const nextShow = !showInfo;
        setShowInfo(nextShow);
        Animated.timing(infoHeight, {
            toValue: nextShow ? infoContentHeight : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [showInfo, infoHeight, infoContentHeight]);

    const handleInfoLayout = useCallback((event: LayoutChangeEvent) => {
        const {height} = event.nativeEvent.layout;
        if (height <= 0 || height === infoContentHeight) return;
        setInfoContentHeight(height);
        if (showInfo) {
            Animated.timing(infoHeight, {
                toValue: height,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    }, [infoContentHeight, infoHeight, showInfo]);

    const handleFavoriteToggle = useCallback(async () => {
        if (!marinaID || !isLoggedIn) return;
        if (userLocation?.id) {
            await deleteUserLocation(
                userLocation.id,
                () => {
                    setUserLocation(undefined);
                    toast.success('Removed from favorites');
                },
                (error) => {
                    toast.error(t("common.error"), {message: t(error.onGetMessage())});
                }
            );
        } else {
            await create(
                {
                    userId: userID,
                    locationId: marinaID,
                    sentHarborNotifications: false,
                },
                (created) => {
                    setUserLocation(created);
                    toast.success('Added to favorites');
                },
                (error) => {
                    toast.error(t("common.error"), {message: t(error.onGetMessage())});
                }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLocation, marinaID, userID]); // create, deleteUserLocation are hook functions

    const handleNotificationToggle = useCallback(async () => {
        if (!marinaID || !userLocation?.id || !isLoggedIn) return;
        await update(
            userLocation.id,
            {
                userId: userID,
                locationId: marinaID,
                sentHarborNotifications: !userLocation.sentHarborNotifications,
            },
            (updated) => {
                setUserLocation(updated);
                toast.success(updated.sentHarborNotifications ? 'Notifications enabled' : 'Notifications disabled');
            },
            (error) => {
                toast.error(t("common.error"), {message: t(error.onGetMessage())});
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLocation, marinaID, userID]); // update is a hook function

    const renderHarborInfoContent = useCallback((extraProps?: Partial<ComponentProps<typeof Card.Footer>>) => (
        <Card.Footer
            padded
            backgroundColor="$gray1"
            borderTopWidth={1}
            borderTopColor="$borderColor"
            {...extraProps}
        >
            <XStack flexWrap="wrap" gap="$4" width="100%">
                <XStack gap="$2" alignItems="center" flexGrow={1} flexShrink={1}
                        style={{flexBasis: infoItemWidth, minWidth: 0}}>
                    <MapPin size={18} color="$gray10"/>
                    <YStack>
                        <Text fontSize="$1" color="$gray11">{t('dashboard.address')}</Text>
                        <Text fontSize="$3">{detailedLocation?.address || t('dashboard.addressValue')}</Text>
                    </YStack>
                </XStack>
                <XStack gap="$2" alignItems="center" flexGrow={1} flexShrink={1}
                        style={{flexBasis: infoItemWidth, minWidth: 0}}>
                    <Clock size={18} color="$gray10"/>
                    <YStack>
                        <Text fontSize="$1" color="$gray11">{t('dashboard.openingHours')}</Text>
                        <Text fontSize="$3">{detailedLocation?.openingHours || t('dashboard.openingHoursValue')}</Text>
                    </YStack>
                </XStack>
            </XStack>
        </Card.Footer>
    ), [infoItemWidth, t, detailedLocation]);

    // Render
    return (
        <View style={{flex: 1}}>
            <YStack flex={1} backgroundColor="$content1">
                <ScrollView style={{flex: 1}}>
                    {/* Header Image with Gradient */}
                    <Stack position="relative" width="100%" height={media.lg ? 350 : 250} overflow="hidden">
                        <Image source={{uri: locationImageUrl}} width="100%" height="100%"/>
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.6)']}
                            style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%'}}
                        />
                        <Stack position="absolute" bottom="$4" left="$4" right="$4">
                            <Text color="white" fontSize="$3" opacity={0.9} marginBottom="$1">
                                {t('dashboard.title')}
                            </Text>
                            <H1 color="white" fontSize={media.lg ? "$10" : "$8"} fontWeight="700"
                                textShadowColor="rgba(0,0,0,0.2)" textShadowOffset={{width: 0, height: 1}}
                                textShadowRadius={2}>
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
                                    {isLoggedIn && (
                                        <XStack>
                                            <Button size="$5" variant="outlined"
                                                    icon={userLocation ? HeartMinus : HeartPlus}
                                                    onPress={handleFavoriteToggle} circular visibility='hidden'/>
                                            {userLocation && (
                                                <Button size="$5" variant="outlined"
                                                        icon={userLocation?.sentHarborNotifications ? BellOff : Bell}
                                                        onPress={handleNotificationToggle} circular/>
                                            )}
                                            <BroadcastNotificationPopover
                                                shouldAdapt={false}
                                                placement="top"
                                                Icon={MessageSquarePlus}
                                                Name={t("harbor.harborMasterNotification")}
                                                userID={userID}
                                                marinaID={marinaID}
                                                t={t}
                                            />
                                        </XStack>
                                    )}
                                </XStack>
                            </View>
                        </Stack>
                    </Stack>

                    {/* Main Content */}
                    <YStack padding={media.md ? "$3" : "$4"} gap={media.md ? "$4" : "$5"}
                            maxWidth={1800} width="100%" alignSelf="center" marginTop={media.md ? -20 : -30}>

                        {/* Harbor Info Card */}
                        <Card bordered padding={2} animation="quick" backgroundColor="$content2"
                              borderWidth={1} borderColor="$borderColor">
                            <Card.Header padded>
                                <XStack justifyContent="space-between" alignItems="center">
                                    <XStack gap="$3" alignItems="center" flex={1}>
                                        <Stack width={44} height={44} borderRadius="$3"
                                               backgroundColor={isDark ? '$gray8' : '$gray3'}
                                               alignItems="center" justifyContent="center">
                                            <Home size={24} color="$gray10"/>
                                        </Stack>
                                        <YStack flex={1}>
                                            <Text color="$gray11" fontSize="$2">{t('dashboard.harbor')}</Text>
                                            <H3 fontSize="$6" fontWeight="600">{harbourName}</H3>
                                        </YStack>
                                    </XStack>
                                    <IconButton size="$3" icon={showInfo ? ChevronUp : ChevronDown}
                                                onPress={toggleInfo}/>
                                </XStack>
                            </Card.Header>
                            <View style={{
                                position: 'absolute',
                                opacity: 0,
                                pointerEvents: 'none',
                                width: '100%',
                                top: 0,
                                left: 0,
                                right: 0
                            }}
                                  onLayout={handleInfoLayout}>
                                {renderHarborInfoContent()}
                            </View>
                            <Animated.View style={{overflow: "hidden", height: infoHeight}}>
                                {renderHarborInfoContent({
                                    pointerEvents: showInfo ? 'auto' : 'none',
                                    style: {opacity: showInfo ? 1 : 0},
                                })}
                            </Animated.View>
                        </Card>

                        {/* Current Measurements */}
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
                            <XStack gap="$3" width="100%" flexWrap={media.md ? "wrap" : "nowrap"}
                                    justifyContent={media.md ? "center" : "space-between"}>
                                {filteredMeasurements.slice(0, 3).map((measurement, index) => (
                                    <Card key={index} bordered backgroundColor="$content2"
                                          flex={media.md ? undefined : 1} width={media.md ? "100%" : undefined}
                                          minWidth={250} borderWidth={1} borderColor="$borderColor">
                                        <Card.Header padded>
                                            <YStack gap="$3" alignItems="center">
                                                {userLocation && (
                                                    <NotificationRuleDialog
                                                        shouldAdapt={false}
                                                        placement="top"
                                                        Icon={Bell}
                                                        Name={getTextFromMeasurementType(measurement.measurementType, t)}
                                                        Value={measurement.value ?? undefined}
                                                        MeasurementType={measurement.measurementType}
                                                        marinaID={marinaID}
                                                        userID={userID}
                                                        measurement={measurement}
                                                        t={t}
                                                    />
                                                )}
                                                <Stack width={56} height={56} borderRadius="$4"
                                                       alignItems="center" justifyContent="center">
                                                    {getMeasurementIcon(measurement.measurementType, 32)}
                                                </Stack>
                                                <YStack alignItems="center" gap="$2">
                                                    <Text color="$gray11" fontSize="$4" fontWeight="600"
                                                          textAlign="center">
                                                        {getTextFromMeasurementType(measurement.measurementType, t)}
                                                    </Text>
                                                    <XStack alignItems="center" gap="$2">
                                                        <H2 fontSize="$10" fontWeight="700"
                                                            color={getMeasurementColor(measurement.measurementType)}>
                                                            {formatMeasurementValue(measurement.value ?? 0)}
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

                        {/* Further Measurements */}
                        {filteredMeasurements.length > 3 && (
                            <YStack gap="$3">
                                <H2 fontSize="$6">{t('dashboard.furtherMeasurements')}</H2>
                                <XStack flexWrap="wrap" gap="$3" justifyContent={media.lg ? 'flex-start' : 'center'}>
                                    {filteredMeasurements.slice(3).map((m, index) => (
                                        <MeasurementCard key={index} measurementType={m.measurementType}
                                                         value={formatMeasurementValue(m.value ?? 0)}/>
                                    ))}
                                </XStack>
                            </YStack>
                        )}

                        <Separator marginVertical="$2"/>

                        {/* Historical Data */}
                        <YStack gap="$4">
                            <XStack alignItems="center" justifyContent="space-between" flexWrap="wrap" gap="$2">
                                <YStack gap="$1">
                                    <H3 fontSize="$5" fontWeight="600">{t('dashboard.historicalData')}</H3>
                                    <Text fontSize="$2" color="$gray11">{getTimeRangeLabel(timeRange, t)}</Text>
                                </YStack>
                                <TimeRangeDropdown selectedTimeRange={timeRange} setTimeRange={setTimeRange}
                                                   isDark={isDark}/>
                            </XStack>
                            <YStack gap="$3" width="100%">
                                <LineChartCard
                                    title={t('dashboard.charts.waterTemperature')}
                                    icon={<Thermometer size={20} color="#F97316"/>}
                                    chartData={chartData.waterTemperature}
                                    color="#F97316"
                                    currentValue={currentValues.waterTemp ?? undefined}
                                />
                                <LineChartCard
                                    title={t('dashboard.charts.waterLevel')}
                                    icon={<Activity size={20} color="#3B82F6"/>}
                                    chartData={chartData.tide}
                                    color="#3B82F6"
                                    currentValue={currentValues.waterLevel ?? undefined}
                                />
                                <LineChartCard
                                    title={t('dashboard.charts.waveHeight')}
                                    icon={<Waves size={20} color="#10B981"/>}
                                    chartData={chartData.waveHeight}
                                    color="#10B981"
                                    currentValue={currentValues.waveHeight ?? undefined}
                                />
                            </YStack>
                        </YStack>
                    </YStack>
                </ScrollView>
            </YStack>
        </View>
    );
}
