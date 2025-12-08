import {LocationWithBoxes} from '@/api/models/sensor';
import {useTranslation} from '@/hooks/ui';
import {AlertCircle, ArrowUpDown, Filter, Search} from '@tamagui/lucide-icons';
import {useMemo, useState} from 'react';
import {Button, H4, Input, ScrollView, Separator, Text, XStack, YStack} from 'tamagui';
import SensorListItem from './SensorListItem';
import {SelectWithSheet} from '@/components/ui/SelectWithSheet';
import {SelectItem} from '@/types/select';
import {fuzzyMatch} from '@/utils/searchUtils';
import {PrimaryButton, PrimaryButtonText} from '@/types/button';
import {calculateDistance, filterSensorsByType, getLatestMeasurementTime} from '@/utils/sensorUtils';

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
        {value: 'all', label: t('sensor.allTypes')},
        {value: 'water', label: t('sensor.waterSensors')},
        {value: 'air', label: t('sensor.airSensors')},
    ];

    // Select items for sort by
    const sortByItems: SelectItem<SortOption>[] = [
        {value: 'distance', label: t('sensor.sortByDistance')},
        {value: 'name', label: t('sensor.sortByName')},
        {value: 'recent', label: t('sensor.sortByRecent')},
    ];

    const getDistance = (sensor: LocationWithBoxes) =>
        calculateDistance(mapCenter, sensor);

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
            filtered = filterSensorsByType(filtered, filterType);
        }

        return [...filtered].sort((a, b) => {
            if (sortBy === 'distance') {
                const distA = getDistance(a);
                const distB = getDistance(b);
                return distA - distB;
            } else if (sortBy === 'name') {
                return (a.location?.name || '').localeCompare(b.location?.name || '');
            } else if (sortBy === 'recent') {
                return getLatestMeasurementTime(b) - getLatestMeasurementTime(a);
            }
            return 0;
        });
    }, [sensorsToDisplay, searchQuery, filterType, sortBy, mapCenter]);

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
                            backgroundColor="$accent6"
                        >
                            <Text fontSize="$3" fontWeight="700" color="$color.black12">
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
                            backgroundColor={!showAllSensors ? "$accent6" : "$content2"}
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
                            backgroundColor={showAllSensors ? "$accent6" : "$content2"}
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
                            <Search size={16}/>
                        </XStack>
                        <Input
                            placeholder={t('sensor.searchSensors')}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            size="$3"
                            placeholderTextColor={"$color"}
                            flex={1}
                            paddingLeft="$8"
                            borderColor="$borderColor"
                            backgroundColor="$content3"
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
                        <YStack
                            padding="$4"
                            paddingTop="$6"
                            alignItems="center"
                            gap="$3"
                            flex={1}
                            justifyContent="center"
                        >
                            <YStack
                                width={80}
                                height={80}
                                borderRadius="$12"
                                backgroundColor="$accent2"
                                alignItems="center"
                                justifyContent="center"
                                marginBottom="$2"
                            >
                                <AlertCircle size={40} color="$accent8"/>
                            </YStack>
                            <Text
                                fontSize="$6"
                                fontWeight="700"
                                color="$accent8"
                                textAlign="center"
                            >
                                {searchQuery
                                    ? t('sensor.noSearchResults')
                                    : t('sensor.noSensorsInView')}
                            </Text>
                            <Text
                                fontSize="$3"
                                color="$gray11"
                                textAlign="center"
                                maxWidth={280}
                            >
                                {t('sensor.noSensorsHint')}
                            </Text>
                            {(searchQuery || filterType !== 'all') && (
                                <PrimaryButton
                                    marginTop="$2"
                                    onPress={() => {
                                        setSearchQuery('');
                                        setFilterType('all');
                                    }}
                                >
                                    <PrimaryButtonText>
                                        {t('sensor.clearFilters')}
                                    </PrimaryButtonText>
                                </PrimaryButton>
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
                            <YStack
                                padding="$4"
                                paddingTop="$6"
                                alignItems="center"
                                gap="$3"
                            >
                                <YStack
                                    width={80}
                                    height={80}
                                    borderRadius="$12"
                                    backgroundColor="$accent6"
                                    alignItems="center"
                                    justifyContent="center"
                                    marginBottom="$2"
                                >
                                    <AlertCircle size={40} color="$color.black12"/>
                                </YStack>
                                <Text
                                    fontSize="$6"
                                    fontWeight="700"
                                    color="$accent8"
                                    textAlign="center"
                                >
                                    {searchQuery
                                        ? t('sensor.noSearchResults')
                                        : t('sensor.noSensorsInView')}
                                </Text>
                                <Text
                                    fontSize="$3"
                                    color="$gray11"
                                    textAlign="center"
                                    maxWidth={280}
                                >
                                    {t('sensor.noSensorsHint')}
                                </Text>
                                {(searchQuery || filterType !== 'all') && (
                                    <PrimaryButton
                                        marginTop="$2"
                                        onPress={() => {
                                            setSearchQuery('');
                                            setFilterType('all');
                                        }}
                                    >
                                        <PrimaryButtonText>
                                            {t('sensor.clearFilters')}
                                        </PrimaryButtonText>
                                    </PrimaryButton>
                                )}
                            </YStack>
                        ) : (
                            <YStack paddingBottom="$4" gap="$2">
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
