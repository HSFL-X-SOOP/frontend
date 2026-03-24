import {
    Card,
    H1,
    H3,
    View,
    XStack,
    YStack,
    Stack,
    Text,
    useTheme
} from 'tamagui';
import {useMedia} from 'tamagui';
import {useLocalSearchParams} from 'expo-router';
import {useTranslation, useToast} from '@/hooks/ui';
import {useThemeContext} from '@/context/ThemeSwitch';
import { useEffect, useMemo, useState } from 'react';
import { Map, Marker} from '@vis.gl/react-maplibre';
import { LocationWithBoxes } from '@/api/models/sensor';
import { getFilteredMeasurements } from '@/utils/sensorMeasurements';
import { AppError } from '@/utils/errors';
import { ChartTimeRange } from '@/components/dashboard/chart/TimeRangeDropdown';
import { useSensorDataNew, useSensorDataTimeRange } from '@/hooks/data/useSensors';
import GpsPin from '@/components/map/markers/GPSMarker';
import { ParentSizeCarousel } from '@/components/publicdisplay/ParentSizeCarousel';
import { formatTimeToLocal } from '@/utils/time';
import { useCallback } from 'react';
import { useIntervalCallback } from '@/hooks/data/useIntervalCallback';
import { WaterTemperatureTile } from '@/components/animatedComponents/animatedMeasurementTiles/waterTemperatureTile';
import { WaveHeightTile } from '@/components/animatedComponents/animatedMeasurementTiles/waveHeightTile';
import { WaterLevelTile } from '@/components/animatedComponents/animatedMeasurementTiles/waterLevelTile';
import { CombinedTile } from '@/components/animatedComponents/animatedMeasurementTiles/combinedTile';
import {
    Clock,
    MapPin,
} from '@tamagui/lucide-icons';
import { DetailedLocationDTO } from '@/api/models/location';
import { useLocations } from '@/hooks/data/useLocations';
import {LOGO} from '@/components/ui/Icons';
import { QRCode } from '@/components/publicdisplay/marlinLiveQRCode';
// ============================================================================
// Main Component
// ============================================================================

interface PublicDisplayScreenProps {
    selectedMarinaName?: string;
    onSelectMarina?: (marinaName: string) => void;
}

export default function PublicDisplayScreen({selectedMarinaName = 'Stadthafen Flensburg "Im Jaich"', onSelectMarina}: PublicDisplayScreenProps = {}) {
    // Hooks
    const media = useMedia();
    const theme = useTheme();
    const {t} = useTranslation();
    const toast = useToast();
    const {isDark} = useThemeContext();
    const logoSize = 160;
    const logoVerticalOffset = 2;


    // MARINA DATEN
    const [marinaID, setMarinaID] = useState<number | null>(null);
    const routeParams = useLocalSearchParams();
    const [allSensorData, setAllSensorData] = useState<LocationWithBoxes[]>([]);
    const [timeRangeData, setTimeRangeData] = useState<LocationWithBoxes | null>(null);
    const [timeRange, setTimeRange] = useState<ChartTimeRange>('24h');
    const {fetchData: fetchTimeRangeData} = useSensorDataTimeRange(marinaID, timeRange);
    const {fetchData: fetchSensors} = useSensorDataNew();
    const [detailedLocation, setDetailedLocation] = useState<DetailedLocationDTO | null>(null);
    const {fetchLocationById} = useLocations()
    const [waterTemperature, setWaterTemperature] = useState<number | undefined>(undefined);
    const [waveHeight, setWaveHeight] = useState<number | undefined>(undefined);
    const [waterLevel, setWaterLevel] = useState<number | undefined>(undefined);
    
    const currentLocation = useMemo(() => {
        return allSensorData
            .find(data => data.location?.id === marinaID)
        
    }, [allSensorData, marinaID]);

    useEffect(() => {
        void fetchSensors(
            (data: LocationWithBoxes[]) => {
                setAllSensorData(data); 
                selectedMarinaName = data.find(loc => loc.location?.id === marinaID)?.location?.name || selectedMarinaName;
            },
            (error: AppError) => {
                toast.error(t('common.error'), {message: t(error.onGetMessage())});
                setAllSensorData([]);
            }
        );
    }, [selectedMarinaName]);

    const getMarinaIdByName = (name: string, locations: LocationWithBoxes[]): number | null => {
        const location = locations.find(loc => loc.location?.name === name);
        return location?.location?.id ?? null;
    };

    useEffect(() => {
        const name = routeParams.name || selectedMarinaName;
        if (!name || !allSensorData.length) return;

        const id = getMarinaIdByName(name as string, allSensorData);
        setMarinaID(id);
    }, [routeParams.name, selectedMarinaName, allSensorData]);

    const filteredMeasurements = useMemo(() => getFilteredMeasurements(timeRangeData), [timeRangeData]);
    useEffect(() => {
        setWaterTemperature(filteredMeasurements.filter(m => m.measurementType === "Temperature, water")[0]?.value ?? undefined);
        setWaterLevel((filteredMeasurements.filter(m => m.measurementType === "Tide")[0]?.value ?? 0) / 100 || undefined);
        setWaveHeight((filteredMeasurements.filter(m => m.measurementType === "Wave Height")[0]?.value ?? undefined) && (filteredMeasurements.filter(m => m.measurementType === "Wave Height")[0]?.value as number));
    }, [filteredMeasurements]);
    const latestTime = timeRangeData?.boxes[0]?.measurementTimes[0]?.time || new Date().toISOString();
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
    }, [marinaID, timeRange]);

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
    }, [marinaID]);

    const updateAllSensorData = useCallback(() => {
        void fetchSensors(
            (data: LocationWithBoxes[]) => setAllSensorData(data),
            (error: AppError) => {
                toast.error(t('common.error'), {message: t(error.onGetMessage())});
                setAllSensorData([]);
            }
        );
    }, []);

    const updateTimeRangeData = useCallback(() => {
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
    }, [marinaID, timeRange]);

    useIntervalCallback(updateAllSensorData, { delay: 60_000, immediate: true, enabled: true });
    useIntervalCallback(updateTimeRangeData, { delay: 60_000, immediate: true, enabled: true });

    // MAP
    const [harbourLatitude, setHarbourLatitude] = useState<number>(54.78431);
    const [harbourLongitude, setHarbourLongitude] = useState<number>(9.43961);
    const [mapZoom, setMapZoom] = useState<number>(14);

    useEffect(() => {
        if (currentLocation?.location?.coordinates) {
            setHarbourLatitude(currentLocation.location.coordinates.lat);
            setHarbourLongitude(currentLocation.location.coordinates.lon);
        }
    }, [currentLocation]);

    const mapStyle = useMemo(() => {
        return isDark
            ? require('@/assets/mapStyles/dark_mode_new.json')
            : require('@/assets/mapStyles/light_mode_new.json');

    }, [isDark]);
    

    const images = {
        wasserstand: "https://placehold.co/400x400/FFFFFF/000000?text=1",
        wellenhoehe: "https://placehold.co/400x400/FFFFFF/000000?text=2",
        wassertemp: "https://placehold.co/400x400/FFFFFF/000000?text=3",
    };
    const list = ['wasserstand', 'wellenhoehe', 'wassertemp'];

    const leftHandSideFlexSize = 0.5;
    const rightHandSideFlexSize = 1;
    return (
        <View style={{flex: 1}}>
            <XStack flex={1} flexBasis={0} backgroundColor="$content1" flexWrap='nowrap'>

                {/* Linke Seite: Karte + Carousel */}
                <YStack flex={leftHandSideFlexSize}  flexBasis={0} padding={"$5"} gap={"$3"} paddingRight={"$3"}>
                    
                    <YStack flex={leftHandSideFlexSize}  flexBasis={0} gap={"$3"}>
                        {/* Marina Name Header */}
                        <Card key={"marina-header-tile"} bordered backgroundColor="$content2" borderWidth={1} borderColor="$borderColor">
                            <H1 fontSize="$9" fontWeight="600" textAlign='center'>{currentLocation?.location?.name}</H1>
                        </Card>


                        {/* Harbour Info + Karte */}
                        <XStack flex={1} gap="$3" width="100%" flexWrap={media.md ? "wrap" : "nowrap"}
                                justifyContent={media.md ? "center" : "space-between"}>

                                    {/* Harbour Info Card (Adresse, Öffnungszeiten) */}
                                        <Card flex={1} flexBasis={0} bordered backgroundColor="$content2"
                                            width={media.md ? "100%" : undefined}
                                            minWidth={200} borderWidth={1} borderColor="$borderColor" padding={16}
                                            >
                                                <YStack gap={"$3"}>
                                                    <XStack gap="$2" alignItems="center" flexGrow={1} flexShrink={1}
                                                            >
                                                        <XStack flexShrink={0} width={48} height={48} alignItems="center" justifyContent="center">
                                                            <MapPin size={48} color="$gray10" />
                                                        </XStack>
                                                        <YStack flex={1} flexShrink={1} minWidth={0}>
                                                            <Text fontSize="$9" color="$gray11">{t('dashboard.address')}</Text>
                                                            <Text fontSize="$6">{detailedLocation?.address || t('dashboard.addressValue')}</Text>
                                                        </YStack>
                                                    </XStack>

                                                    <XStack gap="$2" alignItems="center" flexGrow={1} flexShrink={1}
                                                            >
                                                        <XStack flexShrink={0} width={48} height={48} alignItems="center" justifyContent="center">
                                                            <Clock size={48} color="$gray10"/>
                                                        </XStack>
                                                        <YStack flex={1} flexShrink={1} minWidth={0}>
                                                            <Text fontSize="$9" color="$gray11">{t('dashboard.openingHours')}</Text>
                                                            <Text fontSize="$6">{detailedLocation?.openingHours || t('dashboard.openingHoursValue')}</Text>
                                                        </YStack>
                                                    </XStack>
                                                </YStack>
                                        </Card>


                                        <Card flex={1} flexBasis={0} key={"map-card-tile"} bordered backgroundColor="$content2"
                                                width={media.md ? "100%" : undefined}
                                                minWidth={200} borderWidth={1} borderColor="$borderColor">
                                            <Map
                                                key="map"
                                                mapStyle={mapStyle}
                                                longitude={harbourLongitude}
                                                latitude={harbourLatitude}
                                                zoom={mapZoom}
                                                >
                                                <Marker
                                                key={"user-location"}
                                                latitude={harbourLatitude}
                                                longitude={harbourLongitude}
                                                anchor="center"
                                                >
                                                    <GpsPin
                                                        latitude={harbourLatitude}
                                                        longitude={harbourLongitude}
                                                        />
                                                </Marker>
                                            </Map>
                                        </Card>
                        </XStack>
                    </YStack>

                    {/* Carousel mit Bildern */}
                    <XStack flex={1} flexBasis={0} gap={"$3"}>
                        <Card key={"parent-size-carousel"} flex={1} bordered backgroundColor="$content2"
                            borderWidth={1} borderColor="$borderColor">
                            <ParentSizeCarousel items={images} itemsLabels={list} interval={4000} />
                        </Card>
                    </XStack>
                </YStack>

                {/* Rechte Seite: Messwerte */}
                <YStack flex={rightHandSideFlexSize} flexBasis={0} backgroundColor="$content1" padding={"$5"} gap={"$3"} paddingLeft={"$3"}>
                    
                    <YStack flex={0.5} flexBasis={0} gap={"$3"}>
                        {/* Aktuelle Messwerte Header */}
                        <XStack alignItems="center" justifyContent="space-between">
                            <H3 fontSize="$5" fontWeight="600">{t('dashboard.currentMeasurements')}</H3>
                            <XStack gap="$1" alignItems="center">
                                <Stack width={6} height={6} borderRadius="$5" backgroundColor="$green9"/>
                                <Text fontSize="$2" color="$gray11">
                                    {(timeRange === 'today' || timeRange === 'yesterday') ? t('dashboard.live') : t('last.measurement')} {formatTimeToLocal(latestTime)}
                                </Text>
                            </XStack>
                        </XStack>

                        {/* Aktuelle Messwerte Kacheln */}
                        <XStack flex={1} flexBasis={0}>
                            <Card flex={1} key={"current-measurements-tile"} gap={"$3"} bordered backgroundColor="$content2"
                                width={media.md ? "100%" : undefined}
                                minWidth={200} borderWidth={1} borderColor="$borderColor">
                                    <XStack flex={1} gap="$3" justifyContent='space-around' flexWrap='wrap' padding={"$3"} alignContent='center'>
                                        {waterTemperature !== undefined && (
                                            <WaterTemperatureTile temperatureC={waterTemperature} />
                                        )}
                                        {waterLevel !== undefined && (
                                            <WaterLevelTile 
                                            levelMeters={waterLevel} 
                                            minMeters={-4} 
                                            maxMeters={2} 
                                            tickStepMeters={0.5} 
                                            labelEvery={2} 
                                            labelDecimals={1}
                                            topOffsetPx={20}
                                            />)}
                                        {waveHeight !== undefined&& (
                                            <WaveHeightTile waveHeight={waveHeight}/>
                                        )}
                                    </XStack>
                                </Card>
                        </XStack>
                    </YStack>

                    <YStack flex={1} flexBasis={0} gap={"$3"}>
                        {/* Kombi-Kachel: Wasserstand + Wellentemperatur + Wellenhöhe */}
                        <XStack flex={3} flexBasis={0}>
                            <Card flex={1} flexBasis={0} key={"combined-tile"} gap={"$3"} bordered backgroundColor="$content2"
                                    width={media.md ? "100%" : undefined}
                                    minWidth={200} borderWidth={1} borderColor="$borderColor" justifyContent='center' alignItems='stretch'
                                    >
                            <CombinedTile 
                                levelMeters={waterLevel} 
                                temperatureC={waterTemperature}
                                waveAmplitude={waveHeight}
                                minMeters={-4} 
                                maxMeters={2} 
                                tickStepMeters={0.5} 
                                labelEvery={2} 
                                labelDecimals={1}
                                />
                                </Card>
                        </XStack>

                        <XStack flex={1} flexBasis={0}>
                            {/* Logo + QR-Code */}
                            <Card flex={1} flexBasis={0} key={"logo-qr-tile"} gap={"$3"} bordered backgroundColor="$content2"
                                width={media.md ? "100%" : undefined}
                                maxHeight={200}
                                minWidth={200} borderWidth={1} borderColor="$borderColor">
                                <XStack flex={1} flexBasis={0}justifyContent='space-between' alignContent='center' alignItems='center' padding={25}>
                                        <XStack alignItems="center" jc="flex-start" gap="$2" minHeight={logoSize}>
                                            <YStack height={logoSize} justifyContent="center">
                                                <LOGO
                                                    size={logoSize}
                                                    color={theme.accent8?.val}
                                                    style={{transform: [{translateY: logoVerticalOffset}]}}
                                                    />
                                            </YStack>
                                            <YStack
                                                gap="$0"
                                                justifyContent="center"
                                                alignItems="flex-start"
                                                height={logoSize}
                                                >
                                                <Text fontSize={32} fontFamily={"$oswald"} fontWeight="bold"
                                                    textAlign={"left"} color={theme.accent8?.val}>Marlin</Text>
                                                <Text
                                                    fontSize={18}
                                                    fontWeight="600"
                                                    fontFamily={"$oswald"}
                                                    color={theme.accent8?.val}
                                                    letterSpacing={1}
                                                >
                                                    MARLIN - Maritime Live Information
                                                </Text>
                                            </YStack>
                                        </XStack>
                                    <XStack alignItems="center" justifyContent="center" gap="$2">
                                        <Text                                                
                                            fontSize={24}
                                            fontWeight="600"
                                            fontFamily={"$oswald"}
                                            color={theme.accent8?.val}
                                            letterSpacing={1}>
                                            Scan Here ➟
                                        </Text>
                                        <QRCode />
                                    </XStack>
                                </XStack>
                            </Card>
                        </XStack>
                    </YStack>
                </YStack>
            </XStack>
        </View>
    );
}
