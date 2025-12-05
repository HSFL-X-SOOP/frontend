import {BoxType, LocationWithBoxes} from '@/api/models/sensor';
import {useTranslation} from '@/hooks/ui';
import {AlertCircle, ArrowUpDown, Filter, Search} from '@tamagui/lucide-icons';
import {useMemo, useState} from 'react';
import {Button, H4, Input, ScrollView, Separator, Text, XStack, YStack} from 'tamagui';
import SensorListItem from './SensorListItem';
import {SelectWithSheet} from '@/components/ui/SelectWithSheet';
import {SelectItem} from '@/types/select';
import {fuzzyMatch} from '@/utils/searchUtils';

interface SensorListProps {
    sensors: LocationWithBoxes[];
    allSensors: LocationWithBoxes[];
    onSensorSelect: (sensor: LocationWithBoxes) => void;
    highlightedSensorId?: number | null;
    loading?: boolean;
    mapCenter?: [number, number];
    horizontal?: boolean;
}

type SortOption = 'distance' | 'name' | 'recent';
type FilterType = 'all' | 'water' | 'air';

export default function SensorList({
                                       sensors,
                                       allSensors,
                                       onSensorSelect,
                                       highlightedSensorId,
                                       loading = false,
                                       mapCenter,
                                       horizontal = false
                                   }: SensorListProps) {
    const {t} = useTranslation();

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('distance');
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [showAllSensors, setShowAllSensors] = useState(false);

    const sensorsToDisplay = showAllSensors ? allSensors : sensors;

    // Select items for filter type
    const filterTypeItems: SelectItem<FilterType>[] = [
        { value: 'all', label: t('sensor.allTypes') },
        { value: 'water', label: t('sensor.waterSensors') },
        { value: 'air', label: t('sensor.airSensors') },
    ];

    // Select items for sort by
    const sortByItems: SelectItem<SortOption>[] = [
        { value: 'distance', label: t('sensor.sortByDistance') },
        { value: 'name', label: t('sensor.sortByName') },
        { value: 'recent', label: t('sensor.sortByRecent') },
    ];

    const calculateDistance = useMemo(() => {
        return (sensor: LocationWithBoxes) => {
            if (!mapCenter || !sensor.location) return 0;

            const [mapLon, mapLat] = mapCenter;
            const sensorLat = sensor.location.coordinates.lat;
            const sensorLon = sensor.location.coordinates.lon;

            const R = 6371;
            const dLat = ((sensorLat - mapLat) * Math.PI) / 180;
            const dLon = ((sensorLon - mapLon) * Math.PI) / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((mapLat * Math.PI) / 180) *
                Math.cos((sensorLat * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };
    }, [mapCenter]);

    const processedSensors = useMemo(() => {
        let filtered = sensorsToDisplay;

        if (searchQuery) {
            filtered = filtered.filter((sensor) =>
                fuzzyMatch(searchQuery, [
                    sensor.location?.name || '',
                    ...sensor.boxes.map((b) => b.name),
                ])
            );
        }

        if (filterType !== 'all') {
            filtered = filtered.filter((sensor) => {
                if (filterType === 'water') {
                    return sensor.boxes.some(
                        (box) =>
                            box.type === BoxType.WaterBox ||
                            box.type === BoxType.WaterTemperatureOnlyBox
                    );
                } else if (filterType === 'air') {
                    return sensor.boxes.some((box) => box.type === BoxType.AirBox);
                }
                return true;
            });
        }

        return [...filtered].sort((a, b) => {
            if (sortBy === 'distance') {
                const distA = calculateDistance(a);
                const distB = calculateDistance(b);
                return distA - distB;
            } else if (sortBy === 'name') {
                return (a.location?.name || '').localeCompare(b.location?.name || '');
            } else if (sortBy === 'recent') {
                const getLatestTime = (sensor: LocationWithBoxes) => {
                    let latest = 0;
                    for (const box of sensor.boxes) {
                        if (box.measurementTimes[0]) {
                            const time = new Date(box.measurementTimes[0].time + 'Z').getTime();
                            if (time > latest) latest = time;
                        }
                    }
                    return latest;
                };
                return getLatestTime(b) - getLatestTime(a);
            }
            return 0;
        });
    }, [sensorsToDisplay, searchQuery, filterType, sortBy, calculateDistance]);

    if (loading) {
        return (
            <YStack padding="$4" gap="$3">
                {/* Loading skeletons */}
                {[1, 2, 3, 4, 5].map((i) => (
                    <YStack
                        key={i}
                        height={120}
                        backgroundColor="$content2"
                        borderRadius="$4"
                        animation="quick"
                        opacity={0.5}
                    />
                ))}
            </YStack>
        );
    }

    return (
        <YStack flex={1}>
            {/* Fixed Header Section - NOT scrollable */}
            <YStack backgroundColor="$background" zIndex={1}>
                {/* Header with count and toggle */}
                <YStack padding="$3" paddingBottom="$2">
                    <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                        <H4 fontSize="$5" fontWeight="700" color="$color">
                            {showAllSensors ? t('sensor.allSensors') : t('sensor.sensorsInView')}
                        </H4>
                        <XStack
                            paddingHorizontal="$2.5"
                            paddingVertical="$1.5"
                            borderRadius="$3"
                            backgroundColor="$accent3"
                        >
                            <Text fontSize="$3" fontWeight="700" color="$color12">
                                {processedSensors.length}
                            </Text>
                        </XStack>
                    </XStack>

                    {/* Toggle between viewport and all sensors */}
                    <XStack gap="$2" flexWrap="wrap">
                        <Button
                            size="$2"
                            flex={1}
                            variant={!showAllSensors ? "outlined" : undefined}
                            backgroundColor={!showAllSensors ? "$accent5" : "$content2"}
                            color={!showAllSensors ? "white" : "$color"}
                            onPress={() => setShowAllSensors(false)}
                            borderWidth={!showAllSensors ? 0 : 1}
                            borderColor="$borderColor"
                            hoverStyle={{
                                backgroundColor: !showAllSensors ? "$accent6" : "$content3",
                                borderColor: !showAllSensors ? "$accent7" : "$accent6"
                            }}
                            pressStyle={{
                                backgroundColor: !showAllSensors ? "$accent7" : "$content3",
                                scale: 0.98
                            }}
                            animation="quick"
                        >
                            {t('sensor.inViewport')}
                        </Button>
                        <Button
                            size="$2"
                            flex={1}
                            variant={showAllSensors ? "outlined" : undefined}
                            backgroundColor={showAllSensors ? "$accent5" : "$content2"}
                            color={showAllSensors ? "white" : "$color"}
                            onPress={() => setShowAllSensors(true)}
                            borderWidth={showAllSensors ? 0 : 1}
                            borderColor="$borderColor"
                            hoverStyle={{
                                backgroundColor: showAllSensors ? "$accent6" : "$content3",
                                borderColor: showAllSensors ? "$accent7" : "$accent6"
                            }}
                            pressStyle={{
                                backgroundColor: showAllSensors ? "$accent7" : "$content3",
                                scale: 0.98
                            }}
                            animation="quick"
                        >
                            {t('sensor.showAll')}
                        </Button>
                    </XStack>
                </YStack>

                {/* Search Bar */}
                <YStack paddingHorizontal="$3" paddingBottom="$2">
                    <XStack alignItems="center" gap="$2" position="relative">
                        <XStack position="absolute" left="$3" zIndex={1} pointerEvents="none">
                            <Search size={16} color="$gray10"/>
                        </XStack>
                        <Input
                            placeholder={t('sensor.searchSensors')}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            size="$3"
                            flex={1}
                            paddingLeft="$8"
                            borderColor="$borderColor"
                            backgroundColor="$content2"
                        />
                    </XStack>
                </YStack>

                {/* Filter and Sort Controls */}
                <YStack paddingHorizontal="$3" paddingBottom="$2">
                    <XStack gap="$2" flexWrap="wrap">
                        {/* Filter Type */}
                        <XStack flex={1} minWidth="45%" gap="$2" alignItems="center">
                            <Filter size={16} color="$color"/>
                            <SelectWithSheet
                                id="filter-type-select"
                                name="filterType"
                                items={filterTypeItems}
                                value={filterType}
                                onValueChange={setFilterType}
                                placeholder={t('sensor.filterType')}
                                triggerProps={{
                                    flex: 1,
                                    size: "$3",
                                    iconAfter: null,
                                    backgroundColor: "$content2",
                                    borderColor: "$borderColor",
                                    borderWidth: 1,
                                    hoverStyle: {
                                        backgroundColor: "$content3",
                                        borderColor: "$accent6"
                                    },
                                    pressStyle: {
                                        backgroundColor: "$content3",
                                        borderColor: "$accent7"
                                    }
                                }}
                            />
                        </XStack>

                        {/* Sort By */}
                        <XStack flex={1} minWidth="45%" gap="$2" alignItems="center">
                            <ArrowUpDown size={16} color="$color"/>
                            <SelectWithSheet
                                id="sort-by-select"
                                name="sortBy"
                                items={sortByItems}
                                value={sortBy}
                                onValueChange={setSortBy}
                                placeholder={t('sensor.sortBy')}
                                triggerProps={{
                                    flex: 1,
                                    size: "$3",
                                    iconAfter: null,
                                    backgroundColor: "$content2",
                                    borderColor: "$borderColor",
                                    borderWidth: 1,
                                    hoverStyle: {
                                        backgroundColor: "$content3",
                                        borderColor: "$accent6"
                                    },
                                    pressStyle: {
                                        backgroundColor: "$content3",
                                        borderColor: "$accent7"
                                    }
                                }}
                            />
                        </XStack>
                    </XStack>
                </YStack>

                <Separator/>
            </YStack>

            {/* Scrollable Sensor List - takes remaining space */}
            <YStack flex={1}>
                {horizontal ? (
                    // Horizontal scrolling for mobile bottom sheet
                    processedSensors.length === 0 ? (
                        // No horizontal scroll when no sensors
                        <YStack padding="$4" alignItems="center" gap="$3" flex={1} justifyContent="center">
                            <AlertCircle size={48} color="$gray10"/>
                            <Text fontSize="$5" fontWeight="600" color="$color" textAlign="center">
                                {searchQuery
                                    ? t('sensor.noSearchResults')
                                    : t('sensor.noSensorsInView')}
                            </Text>
                            <Text fontSize="$3" color="$gray11" textAlign="center">
                                {t('sensor.noSensorsHint')}
                            </Text>
                            {(searchQuery || filterType !== 'all') && (
                                <Button
                                    size="$3"
                                    onPress={() => {
                                        setSearchQuery('');
                                        setFilterType('all');
                                    }}
                                >
                                    {t('sensor.clearFilters')}
                                </Button>
                            )}
                        </YStack>
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <XStack gap="$3" paddingHorizontal="$3" paddingVertical="$2">
                                {processedSensors.map((sensor) => (
                                    <YStack key={sensor.location?.id} width={280}>
                                        <SensorListItem
                                            locationWithBoxes={sensor}
                                            onPress={() => onSensorSelect(sensor)}
                                            isHighlighted={sensor.location?.id === highlightedSensorId}
                                        />
                                    </YStack>
                                ))}
                            </XStack>
                        </ScrollView>
                    )
                ) : (
                    // Vertical scrolling for drawer
                    <ScrollView>
                        {processedSensors.length === 0 ? (
                            <YStack padding="$4" alignItems="center" gap="$3">
                                <AlertCircle size={48} color="$gray10"/>
                                <Text fontSize="$5" fontWeight="600" color="$color" textAlign="center">
                                    {searchQuery
                                        ? t('sensor.noSearchResults')
                                        : t('sensor.noSensorsInView')}
                                </Text>
                                <Text fontSize="$3" color="$gray11" textAlign="center">
                                    {t('sensor.noSensorsHint')}
                                </Text>
                                {(searchQuery || filterType !== 'all') && (
                                    <Button
                                        size="$3"
                                        onPress={() => {
                                            setSearchQuery('');
                                            setFilterType('all');
                                        }}
                                    >
                                        {t('sensor.clearFilters')}
                                    </Button>
                                )}
                            </YStack>
                        ) : (
                            <YStack paddingBottom="$4">
                                {processedSensors.map((sensor) => (
                                    <SensorListItem
                                        key={sensor.location?.id}
                                        locationWithBoxes={sensor}
                                        onPress={() => onSensorSelect(sensor)}
                                        isHighlighted={sensor.location?.id === highlightedSensorId}
                                    />
                                ))}
                            </YStack>
                        )}
                    </ScrollView>
                )}
            </YStack>
        </YStack>
    );
}
