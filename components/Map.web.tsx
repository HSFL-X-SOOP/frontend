import {useSensorDataNew} from '@/hooks/data';
import {useSupercluster} from '@/hooks/map';
import type {MapRef} from '@vis.gl/react-maplibre';
import {LngLatBoundsLike, Map,Marker} from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as React from 'react';
import {useMemo, useState, useRef, useEffect} from 'react';
import {View} from 'react-native';
import ClusterMarker from './map/markers/WebClusterMarker';
import SensorMarker from './map/markers/WebSensorMarker';
import {BoxType, LocationWithBoxes} from '@/api/models/sensor';
import MapSensorDrawer from './map/drawers/MapSensorDrawer';
import SensorList from './map/sensors/SensorList';
import MapSensorBottomSheet, {MapSensorBottomSheetRef} from './map/controls/MapSensorBottomSheet';
import {useIsMobileWeb, useIsMobile,useTranslation} from '@/hooks/ui';
import {SpeedDial} from '@/components/speeddial';
import {Plus, Home, Navigation, ZoomIn, ZoomOut, List, Filter} from '@tamagui/lucide-icons';
import MapFilterButton, {MapFilterState} from './map/controls/MapFilterButton';
import * as Location from 'expo-location';
import GpsPin from './map/markers/GPSMarker';
import {MAP_CONSTANTS} from '@/config/constants';

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

    const mapBoundariesLongLat: LngLatBoundsLike = [MAP_CONSTANTS.BOUNDARIES.SW, MAP_CONSTANTS.BOUNDARIES.NE];

    const [zoomLevel, setZoomLevel] = useState<number>(MAP_CONSTANTS.ZOOM_LEVELS.DEFAULT);
    const [bearing, setBearing] = useState(0);
    const [pitch, setPitch] = useState(0);
    const [currentCoordinate, setCurrentCoordinate] = useState<[number, number]>(MAP_CONSTANTS.HOME_COORDINATE);
    const [viewState, setViewState] = useState<{longitude: number; latitude: number; zoom: number}>({
        longitude: MAP_CONSTANTS.HOME_COORDINATE[0],
        latitude: MAP_CONSTANTS.HOME_COORDINATE[1],
        zoom: MAP_CONSTANTS.ZOOM_LEVELS.DEFAULT
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
            if (!sensor.location?.coordinates) return false;
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
        if (!sensor.location?.coordinates) return;
        const {lat, lon} = sensor.location.coordinates;
        setHighlightedSensorId(sensor.location.id);

        mapRef.current?.flyTo({
            center: [lon, lat],
            zoom: Math.max(zoomLevel, MAP_CONSTANTS.ZOOM_LEVELS.SENSOR_DETAIL),
            duration: MAP_CONSTANTS.ANIMATION.CAMERA_DURATION * 2,
        });

        if (isMobile) {
            bottomSheetRef.current?.snapToPeek();
        }

        setTimeout(() => {
            setHighlightedSensorId(null);
        }, MAP_CONSTANTS.ANIMATION.HIGHLIGHT_DURATION);
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
                    key={locationWithBoxes!.location!.id}
                    locationWithBoxes={locationWithBoxes!}
                />
            );
        });
    }, [clusters, getClusterExpansionZoom, highlightedSensorId]);

    const [location, setLocation] = useState<Location.LocationObject | null>(null);

    useEffect(() => {
        (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
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
                    <GpsPin
                        latitude={location?.coords.latitude || 0}
                        longitude={location?.coords.longitude || 0}
                    />
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
                                if (zoomLevel < MAP_CONSTANTS.ZOOM_LEVELS.MAX) {
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
                                if (zoomLevel > MAP_CONSTANTS.ZOOM_LEVELS.MIN) {
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
                                setCurrentCoordinate(MAP_CONSTANTS.HOME_COORDINATE);
                                setViewState({
                                    longitude: MAP_CONSTANTS.HOME_COORDINATE[0],
                                    latitude: MAP_CONSTANTS.HOME_COORDINATE[1],
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

