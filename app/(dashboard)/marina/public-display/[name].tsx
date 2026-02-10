import {
    Card,
    H1,
    H2,
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
import MapWrapper from '@/components/Map';
import MapFilterButton, {MapFilterState} from "@/components/map/controls/MapFilterButton";
import { useMapFilters } from '@/hooks/map/useMapFilters';
import { useEffect, useMemo, useRef, useState } from 'react';
import {LngLatBoundsLike, Map, Marker} from '@vis.gl/react-maplibre';
import { LocationWithBoxes } from '@/api/models/sensor';
import { getFilteredMeasurements } from '@/utils/sensorMeasurements';
import { AppError } from '@/utils/errors';
import { ChartTimeRange } from '@/components/dashboard/chart/TimeRangeDropdown';
import {
    createMeasurementDictionary,
    formatMeasurementValue,
    getMeasurementColor,
    getMeasurementIcon,
    getMeasurementTypeSymbol,
    getTextFromMeasurementType
} from '@/utils/measurements';
import { useSensorDataNew, useSensorDataTimeRange } from '@/hooks/data/useSensors';
import Carousel from 'react-native-reanimated-carousel'
import { LayoutChangeEvent } from "react-native";
import PagerView from 'react-native-pager-view'
import { ScrollView } from "react-native";
import { useSupercluster } from '@/hooks/map/useSupercluster';
import SensorMarker from '@/components/map/markers/WebSensorMarker';
// ============================================================================
// Main Component
// ============================================================================

interface PublicDisplayScreenProps {
    selectedMarinaName?: string;
    onSelectMarina?: (marinaName: string) => void;
}

export default function PublicDisplayScreen({selectedMarinaName = 'Stadthafen Flensburg "Im Jaich"', onSelectMarina}: PublicDisplayScreenProps = {}) {
    const [slot, setSlot] = useState({ w: 0, h: 0 });

    const onLeftLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setSlot((s) => (s.w === width && s.h === height ? s : { w: width, h: height }));
    };
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
    
    const sensorLocations = useMemo(() => {
        return allSensorData
            .filter(data => data.location?.id != null)
            .map(data => ({
                id: data.location!.id,
                name: data.location!.name || ''
            }));
    }, [allSensorData]);

    useEffect(() => {
        void fetchSensors(
            (data: LocationWithBoxes[]) => {setAllSensorData(data.filter(loc => loc.location?.id === marinaID)); console.log('Fetched sensor data:', data.filter(loc => loc.location?.id === marinaID));},
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
    }, [marinaID, timeRange]); // fetchTimeRangeData comes from a hook and is unstable; toast/t are static utilities

    // MAP

    const [viewState, setViewState] = useState<{ longitude: number; latitude: number; zoom: number }>({
        longitude: 9.43961,
        latitude: 54.78431,
        zoom: 12
    });

    const mapStyle = useMemo(() => {
        return isDark
            ? require('@/assets/mapStyles/dark_mode_new.json')
            : require('@/assets/mapStyles/light_mode_new.json');

    }, [isDark]);

    const pins = useMemo(() => {
        if (!allSensorData.length) return null;    
        
        return (
                <SensorMarker
                    key={allSensorData[0]!.location!.id}
                    locationWithBoxes={allSensorData[0]!}
                />
            );
    }, [allSensorData]);
    // Render
    return (
        <View style={{flex: 1}}>
            <XStack flex={1} backgroundColor="$content1">

                <YStack flex={0.25}>
                    <H1>{selectedMarinaName}</H1>
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
                </YStack>

                <YStack flex={1}>
                        <Map
                            //ref={mapRef}
                            initialViewState={viewState}
                            key="map"
                            mapStyle={mapStyle}
                        >
                        </Map>
                </YStack>

            </XStack>
        </View>
    );
}
