import {
    Card,
    H1,
    H2,
    H3,
    View,
    XStack,
    YStack,
    Stack,
    Text
} from 'tamagui';
import {useMedia} from 'tamagui';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {useTranslation, useToast} from '@/hooks/ui';
import {useThemeContext} from '@/context/ThemeSwitch';
import {useSession} from '@/context/SessionContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Map, Marker} from '@vis.gl/react-maplibre';
import { LocationWithBoxes } from '@/api/models/sensor';
import { getFilteredMeasurements } from '@/utils/sensorMeasurements';
import { AppError } from '@/utils/errors';
import { ChartTimeRange } from '@/components/dashboard/chart/TimeRangeDropdown';
import {
    formatMeasurementValue,
    getMeasurementColor,
    getMeasurementIcon,
    getMeasurementTypeSymbol,
    getTextFromMeasurementType
} from '@/utils/measurements';
import { useSensorDataNew, useSensorDataTimeRange } from '@/hooks/data/useSensors';
import GpsPin from '@/components/map/markers/GPSMarker';
import { ParentSizeCarousel } from '@/components/publicdisplay/ParentSizeCarousel';
import { formatTimeToLocal } from '@/utils/time';
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
    const router = useRouter();
    const {t} = useTranslation();
    const toast = useToast();
    const {isDark} = useThemeContext();
    const {session} = useSession();


    // MARINA DATEN
    const [marinaID, setMarinaID] = useState<number | null>(null);
    const routeParams = useLocalSearchParams();
    const [allSensorData, setAllSensorData] = useState<LocationWithBoxes[]>([]);
    const [timeRangeData, setTimeRangeData] = useState<LocationWithBoxes | null>(null);
    const [timeRange, setTimeRange] = useState<ChartTimeRange>('24h');
    const {fetchData: fetchTimeRangeData} = useSensorDataTimeRange(marinaID, timeRange);
    const {fetchData: fetchSensors} = useSensorDataNew();
    
    const currentLocation = useMemo(() => {
        return allSensorData
            .find(data => data.location?.id === marinaID)
        
    }, [allSensorData, marinaID]);

    useEffect(() => {
        void fetchSensors(
            (data: LocationWithBoxes[]) => {
                setAllSensorData(data); 
                console.log('Fetched sensor data:', data.filter(loc => loc.location?.id === marinaID));
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
        console.log('Route params:', routeParams);
        const name = routeParams.name || selectedMarinaName;
        if (!name || !allSensorData.length) return;

        const id = getMarinaIdByName(name as string, allSensorData);
        setMarinaID(id);
        console.log('Selected Marina ID:', id);
    }, [routeParams.name, selectedMarinaName, allSensorData]);

    const filteredMeasurements = useMemo(() => getFilteredMeasurements(timeRangeData), [timeRangeData]);
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

    // MAP
    const [harbourLatitude, setHarbourLatitude] = useState<number>(54.78431);
    const [harbourLongitude, setHarbourLongitude] = useState<number>(9.43961);
    const [mapZoom, setMapZoom] = useState<number>(14);

    useEffect(() => {
        if (currentLocation?.location?.coordinates) {
            console.log('Setting map center to marina coordinates:', currentLocation.location.coordinates);
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
        wasserstand: require('@/assets/images/ChatGPT_example_image_watertemperature.png'),
        wellenhoehe: require('@/assets/images/ChatGPT_example_image_waterlevel.png'),
        wassertemp: require('@/assets/images/ChatGPT_example_image_waveheight.png'),
    };
    const list = ['wasserstand', 'wellenhoehe', 'wassertemp'];
    // Render
    return (
        <View style={{flex: 1}}>
            <XStack flex={1} backgroundColor="$content1">

                <YStack flex={2}  flexBasis={0} padding={"$5"} gap={"$3"} paddingRight={"$3"}>
                    <Card key={"map"} bordered backgroundColor="$content2" borderWidth={1} borderColor="$borderColor">
                        <H1 fontSize="$9" fontWeight="600" textAlign='center'>{currentLocation?.location?.name}</H1>
                    </Card>

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
                                    minWidth={200} borderWidth={1} borderColor="$borderColor">
                                <Card.Header padded>
                                    <YStack gap="$3" alignItems="center">
                                        <Stack width={56} height={56} borderRadius="$4"
                                                alignItems="center" justifyContent="center">
                                            {getMeasurementIcon(measurement.measurementType, 32)}
                                        </Stack>
                                        <YStack alignItems="center" gap="$2">
                                            <Text color="$gray11" fontSize="$4" fontWeight="600"
                                                    textAlign="center">
                                                {getTextFromMeasurementType(measurement.measurementType, t)}
                                            </Text>
                                            <XStack alignItems="center" gap="$2" paddingTop="$1">
                                                <H2 fontSize="$10" lineHeight={56} fontWeight="700"
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

                    <Card key={"map"} flex={1} bordered backgroundColor="$content2"
                        borderWidth={1} borderColor="$borderColor">
                        
                        <ParentSizeCarousel items={images} itemsLabels={list} interval={4000} />
                    </Card>

                </YStack>

                <YStack flex={1}  flexBasis={0} padding={"$5"} paddingLeft={"$3"} minWidth={400}>
                        <Card key={"map"} bordered backgroundColor="$content2"
                                flex={media.md ? undefined : 1} width={media.md ? "100%" : undefined}
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
                </YStack>
            </XStack>
        </View>
    );
}


