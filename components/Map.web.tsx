import {useSensorDataNew} from '@/hooks/useSensors';
import {useSupercluster} from '@/hooks/useSupercluster';
import type {MapRef} from '@vis.gl/react-maplibre';
import {LngLatBoundsLike, Map} from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as React from 'react';
import {useMemo, useState, useRef, useEffect} from 'react';
import {View} from 'react-native';
import ClusterMarker from './map/markers/web/ClusterMarker';
import SensorMarker from './map/markers/web/SensorMarker';
import {BoxType, LocationWithBoxes} from '@/api/models/sensor';
import MapSensorDrawer from './map/drawers/MapSensorDrawer';
import SensorList from './map/sensors/SensorList';
import MapSensorBottomSheet, {MapSensorBottomSheetRef} from './map/controls/MapSensorBottomSheet';
import {useIsMobileWeb, useIsMobile} from '@/hooks/useIsMobileWeb';
import {SpeedDial} from '@/components/speeddial';
import {Plus, Home, Navigation, ZoomIn, ZoomOut, List, Filter} from '@tamagui/lucide-icons';
import MapFilterButton, {MapFilterState} from './map/controls/MapFilterButton';
import {useTranslation} from '@/hooks/useTranslation';
import * as Location from 'expo-location';
import {Marker} from "@vis.gl/react-maplibre";
import { YStack, Text } from 'tamagui';
import GPSMarker from './map/markers/GPSMarker';
import GpsPin from './map/markers/GPSMarker';

interface MapProps {
    module1Visible?: boolean;
    module2Visible?: boolean;
    module3Visible?: boolean;
    isDark?: boolean;
}

export default function WebMap(props: MapProps) {
    const {
        isDark = false
    } = props;
    const {t} = useTranslation();

    // Filter states
    const [module1Visible, setModule1Visible] = useState(props.module1Visible ?? true);
    const [module2Visible, setModule2Visible] = useState(props.module2Visible ?? true);
    const [module3Visible, setModule3Visible] = useState(props.module3Visible ?? false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Create consolidated filter state
    const filterState: MapFilterState = {
        module1Visible,
        module2Visible,
        module3Visible,
    };

    const handleFilterChange = (newState: MapFilterState) => {
        if (newState.module1Visible !== module1Visible) setModule1Visible(newState.module1Visible);
        if (newState.module2Visible !== module2Visible) setModule2Visible(newState.module2Visible);
        if (newState.module3Visible !== module3Visible) setModule3Visible(newState.module3Visible);
    };

    const {data: content, loading} = useSensorDataNew();
    const mapRef = React.useRef<MapRef>(null);
    const bottomSheetRef = React.useRef<MapSensorBottomSheetRef>(null);
    const isMobileWeb = useIsMobileWeb();
    const isMobile = useIsMobile();

    const homeCoordinate: [number, number] = [9.26, 54.47926];
    const minMaxZoomLevel = {min: 3, max: 16};
    const mapBoundariesLongLat: LngLatBoundsLike = [[-31.266001, 27.560001], [49.869301, 71.185001]];

    const [zoomLevel, setZoomLevel] = useState(7);
    const [bearing, setBearing] = useState(0);
    const [pitch, setPitch] = useState(0);
    const [currentCoordinate, setCurrentCoordinate] = useState<[number, number]>(homeCoordinate);
    const [viewState, setViewState] = useState({
        longitude: homeCoordinate[0],
        latitude: homeCoordinate[1],
        zoom: zoomLevel
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [highlightedSensorId, setHighlightedSensorId] = useState<number | null>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const bounds: [number, number, number, number] = useMemo(() => {
        const map = mapRef.current?.getMap();
        if (!map) return [-31.266001, 27.560001, 49.869301, 71.185001];
        const bounds = map.getBounds();
        return [
            bounds.getWest(),
            bounds.getSouth(),
            bounds.getEast(),
            bounds.getNorth(),
        ];
    }, [viewState]);

    const filteredContent = useMemo(() => {
        if (!content) return [];

        return content.filter(locationWithBoxes => {
            const hasWaterBoxes = locationWithBoxes.boxes.some(box =>
                box.type === BoxType.WaterBox || box.type === BoxType.WaterTemperatureOnlyBox
            );
            const hasAirBoxes = locationWithBoxes.boxes.some(box =>
                box.type === BoxType.AirBox
            );

            if (module1Visible && hasWaterBoxes) return true;
            return module2Visible && hasAirBoxes;
        });
    }, [content, module1Visible, module2Visible, module3Visible]);

    const {clusters, getClusterExpansionZoom} = useSupercluster(
        filteredContent,
        bounds,
        zoomLevel
    );

    const visibleSensors = useMemo(() => {
        return filteredContent.filter(sensor => {
            const {lat, lon} = sensor.location.coordinates;
            return (
                lon >= bounds[0] &&
                lat >= bounds[1] &&
                lon <= bounds[2] &&
                lat <= bounds[3]
            );
        });
    }, [filteredContent, bounds]);

    const handleSensorSelect = (sensor: LocationWithBoxes) => {
        const {lat, lon} = sensor.location.coordinates;
        setHighlightedSensorId(sensor.location.id);

        mapRef.current?.flyTo({
            center: [lon, lat],
            zoom: Math.max(zoomLevel, 12),
            duration: 1000,
        });

        if (isMobile) {
            bottomSheetRef.current?.snapToPeek();
        }

        setTimeout(() => {
            setHighlightedSensorId(null);
        }, 3000);
    };


    const mapStyle = useMemo(() => {
        return isDark
            ? require('@/assets/mapStyles/dark_mode_new.json')
            : require('@/assets/mapStyles/light_mode_new.json');

    }, [isDark]);

    const pins = useMemo(() => {
        return clusters.map((cluster) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const {cluster: isCluster, point_count, locationWithBoxes} = cluster.properties;

            if (isCluster) {
                return (
                    <ClusterMarker
                        key={`cluster-${cluster.id}`}
                        latitude={latitude}
                        longitude={longitude}
                        pointCount={point_count!}
                        onClick={() => {
                            const expansionZoom = getClusterExpansionZoom(cluster.id as number);
                            mapRef.current?.flyTo({
                                center: [longitude, latitude],
                                zoom: expansionZoom,
                                duration: 500,
                            });
                        }}
                    />
                );
            }

            return (
                <SensorMarker
                    key={locationWithBoxes!.location.id}
                    locationWithBoxes={locationWithBoxes!}
                />
            );
        });
    }, [clusters, getClusterExpansionZoom, highlightedSensorId]);

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission denied');
            return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        })();
    }, []);

    return (
        <View style={{flex: 1}}>
            {!isMobileWeb && (
                <MapSensorDrawer
                    isOpen={isDrawerOpen}
                    onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
                    sensors={visibleSensors}
                    onSensorSelect={handleSensorSelect}
                >
                    <SensorList
                        sensors={visibleSensors}
                        allSensors={filteredContent}
                        onSensorSelect={handleSensorSelect}
                        highlightedSensorId={highlightedSensorId}
                        loading={loading}
                        mapCenter={currentCoordinate}
                    />
                </MapSensorDrawer>
            )}

            {isMobileWeb && (
                <MapSensorBottomSheet
                    ref={bottomSheetRef}
                    isOpen={isDrawerOpen}
                    onOpenChange={setIsDrawerOpen}
                >
                    <SensorList
                        sensors={visibleSensors}
                        allSensors={filteredContent}
                        onSensorSelect={handleSensorSelect}
                        highlightedSensorId={highlightedSensorId}
                        loading={loading}
                        mapCenter={currentCoordinate}
                        horizontal
                    />
                </MapSensorBottomSheet>
            )}

            <Map
                ref={mapRef}
                initialViewState={viewState}
                onMove={(e) => {
                    if (debounceTimerRef.current) {
                        clearTimeout(debounceTimerRef.current);
                    }

                    setCurrentCoordinate([e.viewState.longitude, e.viewState.latitude]);
                    setZoomLevel(e.viewState.zoom);
                    setBearing(e.viewState.bearing);
                    setPitch(e.viewState.pitch);

                    if (isMobileWeb && bottomSheetRef.current) {
                        bottomSheetRef.current.snapToPeek();
                    }

                    debounceTimerRef.current = setTimeout(() => {
                        setViewState(e.viewState);
                    }, 300);
                }}
                key="map"
                mapStyle={mapStyle}
                maxBounds={mapBoundariesLongLat}
                longitude={currentCoordinate[0]}
                latitude={currentCoordinate[1]}
                zoom={zoomLevel}
                bearing={bearing}
                pitch={pitch}
            >
                {pins}
                {location && (
                    <Marker
                    key={"user-location"}
                    longitude={location?.coords.longitude || 0}
                    latitude={location?.coords.latitude || 0}
                    anchor="center"
                >
                    <GpsPin />
                </Marker>
                )}
            </Map>

            {/* SpeedDial für Web (Mobile und Desktop) */}
            <SpeedDial
                    placement="bottom-right"
                    labelPlacement="left"
                    portal={false}
                    icon={Plus}
                    closeOnActionPress={true}
                    actions={[
                        {
                            key: 'sensors',
                            label: t('navigation.sensors'),
                            icon: List,
                            onPress: () => setIsDrawerOpen(!isDrawerOpen),
                        },
                        {
                            key: 'filter',
                            label: t('map.filters'),
                            icon: Filter,
                            onPress: () => setIsFilterOpen(true),
                        },
                        {
                            key: 'zoomin',
                            label: 'Zoom In',
                            closeOnPress: false,
                            icon: ZoomIn,
                            onPress: () => {
                                if (zoomLevel < minMaxZoomLevel.max) {
                                    const newZoom = zoomLevel + 1;
                                    setZoomLevel(newZoom);
                                    setViewState({
                                        longitude: currentCoordinate[0],
                                        latitude: currentCoordinate[1],
                                        zoom: newZoom
                                    });
                                }
                            },
                        },
                        {
                            key: 'zoomout',
                            label: 'Zoom Out',
                            closeOnPress: false,
                            icon: ZoomOut,
                            onPress: () => {
                                if (zoomLevel > minMaxZoomLevel.min) {
                                    const newZoom = zoomLevel - 1;
                                    setZoomLevel(newZoom);
                                    setViewState({
                                        longitude: currentCoordinate[0],
                                        latitude: currentCoordinate[1],
                                        zoom: newZoom
                                    });
                                }
                            },
                        },
                        {
                            key: 'compass',
                            label: 'Reset View',
                            closeOnPress: false,
                            icon: Navigation,
                            onPress: () => {
                                setBearing(0);
                                setPitch(0);
                            },
                        },
                        {
                            key: 'home',
                            label: 'Go Home',
                            closeOnPress: false,
                            icon: Home,
                            onPress: () => {
                                setCurrentCoordinate(homeCoordinate);
                                setViewState({
                                    longitude: homeCoordinate[0],
                                    latitude: homeCoordinate[1],
                                    zoom: zoomLevel
                                });
                            },
                        },
                    ]}
                    fabSize="$6"
                    gap="$2"
                />

            {/* Filter Sheet - controlled by SpeedDial */}
            <MapFilterButton
                filterState={filterState}
                onFilterChange={handleFilterChange}
                isOpen={isFilterOpen}
                onOpenChange={setIsFilterOpen}
            />
        </View>
    );
}

